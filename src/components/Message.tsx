import { IonItem, IonLabel, IonNote, IonIcon } from "@ionic/react";
import { personCircle } from "ionicons/icons";
import { Message } from "../data/messages";
import "./Message.css";
import { formatDate } from "../utils/formatDate";

interface MessageProps {
  message: Message;
}

const MessageComponent: React.FC<MessageProps> = ({ message }) => {
  return (
    <>
      <IonItem className="message-user" lines="none">
        <IonIcon
          aria-hidden="true"
          icon={personCircle}
          color="primary"
        ></IonIcon>
        <IonLabel className="ion-text-wrap">
          <h2>
            {message.user.name}
            <span className="userId">@{message.user.id}</span>
          </h2>
        </IonLabel>
      </IonItem>
      <div className="content">
        <p className="body">{message.body}</p>
        <IonNote className="date">
          {formatDate(new Date(message.date), "hh:mm・YYYY年MM月DD日")}
        </IonNote>
      </div>
    </>
  );
};

export default MessageComponent;
