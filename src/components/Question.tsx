import "../styles/question.scss";
import "../styles/animations.scss";

type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    };
    animationDelay: number;
}

export function Question(props: QuestionProps) {
    return (
        <div className="question animate-up" style={{ animationDelay: `${props.animationDelay}ms` }}>
            <p>{ props.content }</p>
            <footer>
                <div className="user-info">
                    <img src={ props.author.avatar } alt={props.author.name}/>
                    <span>{ props.author.name }</span>
                </div>
                <div></div>
            </footer>
        </div>
    );
}