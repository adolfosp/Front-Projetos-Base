import { Counter } from './Counter'

export default function PostsLayout({children}){
    return(
        <div>
            <Counter />
            {children}
        </div>
    )
}