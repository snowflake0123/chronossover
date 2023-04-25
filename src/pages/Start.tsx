import {
  IonContent,
  IonInput,
  IonDatetime,
  IonDatetimeButton,
  IonButton,
  IonModal,
} from "@ionic/react";
import {
  IonInputCustomEvent,
  InputChangeEventDetail,
  IonDatetimeCustomEvent,
  DatetimeChangeEventDetail,
} from "@ionic/core";
import { AppContext } from "../App";
import { useState, useContext } from "react";
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";

const Start = () => {
  const { openaiApiKey, targetYear } = useContext(AppContext);
  const [response, setResponse] = useState("");

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
    const configuration = new Configuration({ apiKey: openaiApiKey.state });
    const openai = new OpenAIApi(configuration);
    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: ChatCompletionRequestMessageRoleEnum.User,
            content: `${targetYear.state}年の「今年の漢字」は何になりそうか予想してください。`,
          },
        ],
      });
      const answer = response.data.choices[0].message?.content;
      answer && setResponse(answer);
      console.log(answer);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <IonContent className="ion-padding">
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
      <IonButton onClick={handleButtonClick}>送信</IonButton>
      {response ? response : <>ここにレスポンスが表示されます</>}
    </IonContent>
  );
};

export default Start;
