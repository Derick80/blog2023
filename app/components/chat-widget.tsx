import React from "react";
import Button from "./button";
import { Form } from "@remix-run/react";

export default function ChatWidget() {
    const [chatPanelOpen, setChatPanelOpen] = React.useState(false)
const data =
   { messages: 
       [ {
            id: 1,
            content: 'Hello',
            userId: 1
        },
        {
            id: 2,
            content: 'Hi',
            userId: 2
        }
]

    }

    return chatPanelOpen ? (
        <div className="fixed bottom-10 right-10 w-96 h-96 bg-white border-2 text-gray-500">
            <Button onClick={() => setChatPanelOpen(false)} variant="primary_filled" size='base' className="absolute top-2 right-2">
                X
            </Button>
            <ul>
                {data.messages.map(({content, id, userId})=>(
                    <li key={id}>{content}</li>
                    
                ))}

            </ul>
           <Form method='POST' className='mt-10'>
           <input className="border rounded-md w-full absolute bottom-4" type='text' name='content' />
            <Button variant="primary_filled" size='base' className="absolute bottom-4 right-4">
                Send
            </Button>
           </Form>

            </div>
    ):(
        <Button
        onClick={() => setChatPanelOpen(true)}
        variant="primary_filled"
        size='base'
            className="fixed bottom-10 right-10 bg-white border-2 border-gray-200 rounded-lg shadow-lg px-4 text-gray-700"
        >
            Chat
        </Button>
    )
}