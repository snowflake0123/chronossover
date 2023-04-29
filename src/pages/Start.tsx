import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  IonContent,
  IonInput,
  IonDatetime,
  IonDatetimeButton,
  IonButton,
  IonModal,
  IonProgressBar,
} from "@ionic/react";
import {
  IonInputCustomEvent,
  InputChangeEventDetail,
  IonDatetimeCustomEvent,
  DatetimeChangeEventDetail,
} from "@ionic/core";
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";
import { backOff } from "exponential-backoff";

import { AppContext } from "../App";
import { prompts } from "../data/prompt";

const Start = () => {
  const { openaiApiKey, targetYear, messages } = useContext(AppContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [trends, setTrends] = useState<string>("");
  const history = useHistory();

  const handleApiKeyChange = (
    event: IonInputCustomEvent<InputChangeEventDetail>
  ) => {
    event.target.value && openaiApiKey.setState(event.target.value.toString());
  };

  const handleYearChange = (
    event: IonDatetimeCustomEvent<DatetimeChangeEventDetail>
  ) => {
    const selectedDate =
      event.target.value && new Date(event.target.value.toString());
    selectedDate && targetYear.setState(selectedDate?.getFullYear() || -1);
  };

  const handleButtonClick = async () => {
    console.log(`APIキー: ${openaiApiKey.state}`);
    console.log(`選択された年: ${targetYear.state}`);
    if (!openaiApiKey.state || !targetYear.state) {
      console.log("どっちかの値が不正です！");
      return;
    }
    setLoading(true);
    const configuration = new Configuration({ apiKey: openaiApiKey.state });
    const openAIApi = new OpenAIApi(configuration);
    const targetAge =
      new Date().getFullYear() > targetYear.state ? "past" : "future";

    // トレンドの取得
    try {
      const fetchedTrends = await backOff(() =>
        requestToChatGPT({
          openAIApi,
          messages: [
            {
              role: ChatCompletionRequestMessageRoleEnum.User,
              content: prompts.forFetchTrends[targetAge]({
                year: targetYear.state,
              }),
            },
          ],
        })
      );
      if (!fetchedTrends) {
        console.error("トレンドの取得に失敗しました");
        return;
      }
      setTrends(fetchedTrends);
    } catch (error: unknown) {
      window.alert(
        "[fetch trends] OpenAI API との通信に失敗しました。時間をおいてから再度試してください。"
      );
      console.error(error);
      return;
    }

    // コメントの取得
    try {
      const fetchedComments = await backOff(() =>
        requestToChatGPT({
          openAIApi,
          messages: [
            {
              role: ChatCompletionRequestMessageRoleEnum.User,
              content: prompts.forFetchComments({
                year: targetYear.state,
                trends,
              }),
            },
          ],
        })
      );
      if (!fetchedComments) {
        console.error("コメントの取得に失敗しました");
        return;
      }
      // UNDONE: fetchedComments を messages にパースする
      messages.setState([
        {
          id: "11223112312",
          user: {
            id: "hogehogeko",
            name: "ほげほげこ",
          },
          date: "2022-01-01T00:00:00.000Z",
          body: fetchedComments,
        },
      ]);
    } catch (error: unknown) {
      window.alert(
        "[fetch comments] OpenAI API との通信に失敗しました。時間をおいてから再度試してください。"
      );
      console.error(error);
      return;
    }
    setLoading(false);
    history.push("/home");
    return;
  };

  return (
    <IonContent className="ion-padding">
      {loading && <IonProgressBar type="indeterminate"></IonProgressBar>}
      <IonInput
        value={openaiApiKey.state}
        placeholder="OpenAI API Key を入力してください"
        onIonChange={handleApiKeyChange}
      />
      <IonDatetimeButton datetime="datetime"></IonDatetimeButton>

      <IonModal keepContentsMounted={true}>
        <IonDatetime
          id="datetime"
          presentation="year"
          min="1900-01-01"
          max="2100-01-01"
          onIonChange={handleYearChange}
        />
      </IonModal>
      <IonButton onClick={handleButtonClick}>Chronossover!</IonButton>
      <p>{trends ? trends : "ここにトレンドが表示される予定です"}</p>
    </IonContent>
  );
};

export default Start;

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
