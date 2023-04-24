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
import React, { useState } from "react";
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";

const ChatGptTest = () => {
  const [apiKey, setApiKey] = useState("");
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [response, setResponse] = useState("");

  const handleApiKeyChange = (
    event: IonInputCustomEvent<InputChangeEventDetail>
  ) => {
    event.target.value && setApiKey(event.target.value.toString());
  };

  const handleClipboardEvent = (
    event: React.ClipboardEvent<HTMLIonInputElement>
  ) => {
    event.clipboardData.getData("text") &&
      setApiKey(event.clipboardData.getData("text"));
  };

  const handleYearChange = (
    event: IonDatetimeCustomEvent<DatetimeChangeEventDetail>
  ) => {
    const selectedDate =
      event.target.value && new Date(event.target.value.toString());
    selectedDate &&
      setSelectedYear(selectedDate?.getFullYear().toString() || "");
  };

  const handleButtonClick = async () => {
    console.log(`APIキー: ${apiKey}`);
    console.log(`選択された年: ${selectedYear}`);
    const configuration = new Configuration({ apiKey });
    const openai = new OpenAIApi(configuration);
    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: ChatCompletionRequestMessageRoleEnum.User,
            content: `${selectedYear}年の「今年の漢字」は何になりそうか予想してください。`,
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
        value={apiKey}
        placeholder="OpenAI API Key を入力してください"
        onIonChange={handleApiKeyChange}
        onPaste={handleClipboardEvent}
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

export default ChatGptTest;
