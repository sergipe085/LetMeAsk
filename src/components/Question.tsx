import "../styles/question.scss";
import "../styles/animations.scss";

import { ReactNode } from "react";

import cx from "classnames";

type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    };
    animationDelay: number;
    children?: ReactNode;
    isAnswered?: boolean;
    isHighlighted?: boolean;
}

export function Question(props: QuestionProps) {
    return (
        <div className={cx("animate-up", "question", {answered: props.isAnswered}, {highlighted: props.isHighlighted && !props.isAnswered})} style={{ animationDelay: `${props.animationDelay}ms`}}>
            <p>{ props.content }</p>
            <footer>
                <div className="user-info">
                    <img src={ props.author.avatar } alt={props.author.name}/>
                    <span>{ props.author.name }</span>
                </div>
                <div>
                    { props.children }
                </div>
            </footer>
        </div>
    );
}