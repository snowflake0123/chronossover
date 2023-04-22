export interface Message {
  /** UUID */
  id: string;
  user: {
    id: string;
    name: string;
  };
  /** ISO8601 */
  date: string;
  body: string;
}

const messages: Message[] = [
  {
    id: "a",
    user: {
      id: "mochi_mochi",
      name: "もちもち",
    },
    date: "2050-01-01T10:30:00+09:00",
    body: "VR旅行ってまるで本当に旅行してるみたいで楽しいね #VR旅行 #最高",
  },
  {
    id: "b",
    user: {
      id: "sushi_lover",
      name: "寿司大好き",
    },
    date: "2050-01-05T15:20:00+09:00",
    body: "新幹線の中で寿司食べながら仕事してる #自動運転車 #最高",
  },
  {
    id: "c",
    user: {
      id: "taro_taro",
      name: "太郎",
    },
    date: "2050-01-10T20:45:00+09:00",
    body: "代替肉のハンバーガーおいしいけど、肉肉しさには勝てないな #代替肉 #ヘルシー",
  },
  {
    id: "d",
    user: {
      id: "yuka_yuka",
      name: "ゆかゆか",
    },
    date: "2050-01-15T12:00:00+09:00",
    body: "家にロボットがいるって本当に未来感あるね #家庭用ロボット #便利",
  },
  {
    id: "e",
    user: {
      id: "hinata_hina",
      name: "ひなた",
    },
    date: "2050-01-20T08:10:00+09:00",
    body: "ハイパーループってすごいね、もう旅行の時代じゃないの？ #ハイパーループ #未来すぎ",
  },
  {
    id: "f",
    user: {
      id: "kei_kei",
      name: "けいけい",
    },
    date: "2050-01-25T16:30:00+09:00",
    body: "空飛ぶクルマって本当に実現するのかな、楽しみだな #空飛ぶクルマ #未来",
  },
  {
    id: "g",
    user: {
      id: "akira_akira",
      name: "アキラ",
    },
    date: "2050-02-01T09:00:00+09:00",
    body: "自動翻訳サービス、外国語が苦手な人には本当にありがたいよね #自動翻訳 #便利",
  },
  {
    id: "h",
    user: {
      id: "yuko_yuko",
      name: "ゆうこ",
    },
    date: "2050-02-05T14:20:00+09:00",
    body: "ゲーミフィケーションの健康管理アプリ楽しいし、運動不足解消にもいいね #ゲーミフィケーション #健康",
  },
  {
    id: "i",
    user: {
      id: "takashi_takashi",
      name: "タカシ",
    },
    date: "2050-02-10T19:00:00+09:00",
    body: "衣服のレンタルっていいね、いろんなスタイルが手軽に楽しめるし #サステナビリティ #衣服レンタル",
  },
  {
    id: "j",
    user: {
      id: "mai_mai",
      name: "まいまい",
    },
    date: "2050-02-15T11:40:00+09:00",
    body: "3Dプリンターでオリジナルの家具作ったよ、DIYって楽しいね #3Dプリンター #DIY",
  },
];

export const getMessages = () => messages;

export const getMessage = (id: string) => messages.find((m) => m.id === id);
