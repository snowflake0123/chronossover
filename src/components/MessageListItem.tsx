import { IonItem, IonLabel, IonNote, IonIcon } from "@ionic/react";
import { personCircle } from "ionicons/icons";
import { Message } from "../data/messages";
import "./MessageListItem.css";
import { formatDate } from "../utils/formatDate";

interface MessageListItemProps {
  message: Message;
}

const MessageListItem: React.FC<MessageListItemProps> = ({ message }) => {
  return (
    <IonItem className="message-list-item" routerLink={`/message/${message.id}`} lines="full">
      <IonIcon
        slot="start"
        aria-hidden="true"
        icon={personCircle}
        color="primary"
      />
      <IonLabel>
        <h2 className="ion-text-nowrap">
          {message.user.name}
          <span className="userId">@{message.user.id}</span>
          <span className="date">
            <IonNote>{formatDate(new Date(message.date))}</IonNote>
          </span>
        </h2>
        <p className="ion-text-wrap">{message.body}</p>
      </IonLabel>
    </IonItem>
  );
};

export default MessageListItem;
