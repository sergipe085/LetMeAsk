import { useHistory, useParams } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom';

import logoImg from "../assets/images/logo.svg";
import removeImg from "../assets/images/delete.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";

import { Button } from "../components/Button";
import { Question } from '../components/Question';
import { RoomCode } from "../components/RoomCode";

import "../styles/room.scss";
import { database } from '../services/firebase';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const { user } = useAuth();
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { questions, title } = useRoom(roomId);

    useEffect(() => {
        isOwner(user?.id).then((res) => {
            if (res == false) {
                history.push(`/rooms/${roomId}`);
            }
        })
    }, [user])

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        });

        toast.success("👍");

        history.push("/");
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        const questionRef = database.ref(`rooms/${roomId}/questions/${questionId}`);

        await questionRef.update({
            isAnswered: true,
        })
    }

    async function handleHightlightQuestion(questionId: string) {
        const questionRef = database.ref(`rooms/${roomId}/questions/${questionId}`);

        await questionRef.update({
            isHighlighted: true,
        })
    }

    async function handleRemoveQuestion(questionId: string) {
        if (window.confirm("Tem certeza que você deseja remover esta pergunta?")) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
            toast.success("👍");
        }
    }

    async function isOwner(userId: string | undefined) {
        const roomRef = await database.ref(`rooms/${roomId}`).get();
        const room = roomRef.val();

        return userId == room.authorId;
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
                            return ( 
                                <Question isAnswered={question.isAnswered} isHighlighted={question.isHighlighted} animationDelay={index * 50} key={question.id} content={question.content} author={question.author}>
                                    {
                                        !question.isAnswered && (
                                            <>
                                                <button type="button" onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                                                    <img src={checkImg} alt="Marcar pergunta como respondida"/>
                                                </button>
                                                <button type="button" onClick={() => handleHightlightQuestion(question.id)}>
                                                    <img src={answerImg} alt="Dar destaque a pergunta"/>
                                                </button>
                                            </>
                                        )
                                    }
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