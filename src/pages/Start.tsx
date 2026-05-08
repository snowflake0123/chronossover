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
import { parseRawResponseToMessage } from "../data/messages";

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
    const targetAge = new Date().getFullYear() > targetYear.state ? "past" : "future";

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
      console.log(fetchedTrends);
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
      console.log(fetchedComments);
      const parsedComments = parseRawResponseToMessage(fetchedComments);
      console.log(parsedComments)
      messages.setState(parsedComments);
    } catch (error: unknown) {
      window.alert(
        "[fetch comments] OpenAI API との通信に失敗しました。時間をおいてから再度試してください。"
      );
      console.error(error);
      return;
    }
//     const messageExample = `@hikari2051, 光, 2051-04-12T14:23:56+09:00, 今日のランチは超美味しかった！ #グリーンフード最高 #健康第一 #今日のお昼はサラダ\\eot
// @haru0328, 春, 2051-04-12T14:25:12+09:00, 私も昨日、グリーンフードのカフェに行ったよ！ #健康生活 #グラノーラ最高 #大満足\\eot
// @taro05, 太郎, 2051-04-12T14:25:48+09:00, グリーンフードは嫌いだけど、それを批判するわけじゃないよ。好みがあるからね。 #食べ物は自由 #尊重しよう\\eot
// @abe51, 安倍, 2051-04-12T16:03:25+09:00, 今日の総理官邸の会議は大変だった。国の将来のために頑張ります。 #政治家の仕事は大変 #日本を良くする為に\\eot
// @sakura0515, 春香, 2051-04-12T16:05:41+09:00, 安倍首相、頑張ってください！ #頑張れ日本 #安倍首相応援\\eot
// @takeshi_w, 武, 2051-04-12T16:07:15+09:00, 官邸前に押しかける愚か者たち、大企業だろうが平等に扱われるべきですよ。 #言葉遣いを気をつけよう #政治的見解以外は控えよう\\eot
// @yuriko_k, 百合子, 2051-04-12T18:32:09+09:00, 日本のポップカルチャーが世界で人気急上昇中！ #jpop #アニメ #日本カワイイ\\eot
// @ryuji0511, 龍司, 2051-04-12T18:33:15+09:00, 海外でも日本のアニメが大人気だね！すごいね！ #日本文化は素晴らしい #アニメ好きの人はリプよろ\\eot
// @miho2051, 美穂, 2051-04-12T18:35:10+09:00, 日本の文化は西洋化しすぎている！ #伝統を守ろう #日本古来の文化に誇りを\\eot
// @yoko0519, 陽子, 2051-04-12T20:17:22+09:00, 明日の天気は晴れ！ #明日はお出かけしよう #お天気情報\\eot
// @yui0514, 結衣, 2051-04-12T20:18:45+09:00, 今からお店行ってくる！ #今日も1日お疲れ様 #リラックスタイム\\eot
// @takumi0517, 匠, 2051-04-12T20:19:19+09:00, 明日は自転車で出かけよう！ #エコライフ #健康的 #自転車愛好家\\eot
// @kaoru0001, 薫, 2051-04-12T22:49:32+09:00, 今日のスマホのアプリが面白かった！ #テクノロジー最高 #未来はすごい\\eot
// @ryo2051, 亮, 2051-04-12T22:50:05+09:00, スマホ依存は危険だと思う #ちょっとスマホ休憩 #現実を見よう\\eot
// @hana0518, 花, 2051-04-12T22:51:11+09:00, 科学技術が進化したら、私たちも進化するかもしれないね！ #未来は想像できない #ワクワク\\eot
// @tomoya_0511, 智也, 2051-04-12T22:52:07+09:00, 科学技術だけに頼らず、経験と知恵も必要だよね。 #バランスが大事 #経験は人を作る\\eot`;
//     messages.setState(parseRawResponseToMessage(messageExample));
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
