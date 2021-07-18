import { useHistory, useParams } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom';

import logoImg from "../assets/images/logo.svg";
import removeImg from "../assets/images/delete.svg";

import { Button } from "../components/Button";
import { Question } from '../components/Question';
import { RoomCode } from "../components/RoomCode";

import "../styles/room.scss";
import { database } from '../services/firebase';
import toast from 'react-hot-toast';

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { questions, title } = useRoom(roomId);

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        });

        toast.success("👍");

        history.push("/");
    }

    async function handleRemoveQuestion(questionId: string) {
        if (window.confirm("Tem certeza que você deseja encerrar esta sala?")) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
            toast.success("👍");
        }
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask"/>
                    <div>
                        <RoomCode code={roomId}/>
                        <Button onClick={handleEndRoom} isOutlined>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <div className="content">
                <div className="room-title">
                    <h1>Sala { title }</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta{ questions.length > 1 && <>s</> }</span> }
                </div>

                <div className="questions-container">
                    {
                        questions.map((question, index) => {
                            console.log(index);
                            return ( 
                                <Question animationDelay={index * 250} key={question.id} content={question.content} author={question.author}>
                                    <button type="button" onClick={() => handleRemoveQuestion(question.id)}>
                                        <img src={removeImg} alt="Remover pergunta"/>
                                    </button>
                                </Question>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}