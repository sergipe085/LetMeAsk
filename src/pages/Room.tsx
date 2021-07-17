import { useEffect } from 'react';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import logoImg from "../assets/images/logo.svg";

import { Button } from "../components/Button";
import { Question } from '../components/Question';
import { RoomCode } from "../components/RoomCode";

import { database } from '../services/firebase';

import "../styles/room.scss";

type RoomParams = {
    id: string;
}

export function Room() {
    const { user, signInWithGoogle } = useAuth();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const [newQuestion, setNewQuestion] = useState("");
    const { questions, title } = useRoom(roomId);

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();

        if (newQuestion.trim() === "") {
            toast.error("👎");
            return;
        }

        if (!user) {
            toast.error("👎");
            return;
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighlighted: false,
            isAnswered: false,
        }

        await database.ref(`rooms/${roomId}/questions`).push(question);

        setNewQuestion("");
        toast.success("👍");
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask"/>
                    <RoomCode code={roomId}/>
                </div>
            </header>

            <div className="content">
                <div className="room-title">
                    <h1>Sala { title }</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta{ questions.length > 1 && <>s</> }</span> }
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea 
                        placeholder="O que voce quer perguntar?" 
                        onChange={(event) => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />
                    <div className="form-footer">
                        {
                            user ? (
                                <div className="user-info">
                                    <img src={user.avatar} alt={user.name}/>
                                    <span>{user.name}</span>
                                </div>
                            ) : (
                                <span>Para enviar sua pergunta, <button onClick={signInWithGoogle} type="button">faca seu login</button>.</span>
                            )
                        }
                        <Button type="submit" disabled={user == null}>Enviar pergunta</Button>
                    </div>
                </form>

                <div className="questions-container">
                    {
                        questions.map((question, index) => {
                            console.log(index);
                            return ( <Question animationDelay={index * 250} key={question.id} content={question.content} author={question.author}/> )
                        })
                    }
                </div>
            </div>
        </div>
    )
}