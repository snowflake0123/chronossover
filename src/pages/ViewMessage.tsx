import { v4 as uuidv4 } from "uuid";
import { useState, useContext } from "react";
import { AppContext } from "../App";
import { Message, findMessageById } from "../data/messages";
import { useHistory } from "react-router";
import { IonTextareaCustomEvent, TextareaChangeEventDetail } from "@ionic/core";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
  IonSpinner,
  IonTextarea,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import { personCircle } from "ionicons/icons";
import { useParams } from "react-router";
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";
import { backOff } from "exponential-backoff";

import { prompts } from "../data/prompt";
import "./ViewMessage.css";
import MessageComponent from "../components/Message";

function ViewMessage() {
  const { openaiApiKey, messages, targetYear } = useContext(AppContext);
  const [message, setMessage] = useState<Message>();
  const [replies, setReplies] = useState<Message[]>([]);
  const [replyInput, setReplyInput] = useState<string>("");
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const params = useParams<{ id: string }>();
  const history = useHistory();

  useIonViewWillEnter(() => {
    const msg = findMessageById(messages.state, params.id);
    if (!msg) {
      window.alert("メッセージが見つかりませんでした");
      history.push("/");
      return;
    }
    setMessage(msg);
  });

  const handleReplyInputChange = (
    e: IonTextareaCustomEvent<TextareaChangeEventDetail>
  ) => {
    e.target.value && setReplyInput(e.target.value);
  };

  const handleReplyButtonClick = () => {
    if (!message) return;
    const yourReply: Message = {
      id: uuidv4(),
      user: {
        id: "you",
        name: "You",
      },
      date: new Date().toISOString(),
      body: replyInput,
    };
    setReplies((prevReplies) => [...prevReplies, yourReply]);
    setReplyInput("");
    setTimeout(async () => {
      setIsReplying(true);
      const configuration = new Configuration({ apiKey: openaiApiKey.state });
      const openAIApi = new OpenAIApi(configuration);
      try {
        console.log(
          prompts.forFetchReply({
            year: targetYear.state,
            message,
            prevReplies: [...replies, yourReply],
          })
        );
        const fetchedReply = await backOff(() =>
          requestToChatGPT({
            openAIApi,
            messages: [
              {
                role: ChatCompletionRequestMessageRoleEnum.User,
                content: prompts.forFetchReply({
                  year: targetYear.state,
                  message,
                  prevReplies: [...replies, yourReply],
                }),
              },
            ],
          })
        );
        setIsReplying(false);
        if (!fetchedReply) {
          console.error("トレンドの取得に失敗しました");
          return;
        }
        console.log(fetchedReply);
        const newReply: Message = {
          id: uuidv4(),
          user: message.user,
          date: message.date,
          body: fetchedReply,
        };
        setReplies((prevReplies) => [...prevReplies, newReply]);
      } catch (error: unknown) {
        window.alert(
          "[fetch reply] OpenAI API との通信に失敗しました。時間をおいてから再度試してください。"
        );
        console.error(error);
        return;
      }
    }, 2000);
  };

  return (
    <IonPage id="view-message-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              text={`Timeline in ${targetYear.state.toString()}`}
              defaultHref="/home"
            ></IonBackButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {message ? (
          <MessageComponent message={message} />
        ) : (
          <div>Message not found</div>
        )}
        {replies.length > 0 &&
          replies.map((reply) => {
            return <MessageComponent key={reply.id} message={reply} />;
          })}
        {isReplying && (
          <IonItem className="reply-spinner">
            <IonSpinner name="dots" />
          </IonItem>
        )}
        <IonItem className="reply-input">
          <IonIcon aria-hidden="true" icon={personCircle} color="primary" />
          <IonTextarea
            placeholder="返信を入力"
            autoGrow={true}
            value={replyInput}
            onIonChange={handleReplyInputChange}
          ></IonTextarea>
          <IonButton
            shape="round"
            size="default"
            color="primary"
            onClick={handleReplyButtonClick}
          >
            送信
          </IonButton>
        </IonItem>
      </IonContent>
    </IonPage>
  );
}

export default ViewMessage;

async function requestToChatGPT({
  openAIApi,
  model = "gpt-3.5-turbo",
  messages,
}: {
  openAIApi: OpenAIApi;
  messages: ChatCompletionRequestMessage[];
  model?: "gpt-3.5-turbo";
}) {
  const response = await openAIApi.createChatCompletion({
    model,
    messages,
  });
  return response.data.choices[0].message?.content;
}
