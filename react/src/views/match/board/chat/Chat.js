import {useDispatch, useSelector} from "react-redux";
import {Button, Form, Input} from "antd";
import {sendChatMessage} from "../../../../actions/chat";
import styled from "styled-components";
import {useRef} from "react";
import _ from 'lodash';

const SForm = styled(Form)`
    border-top: #adadad 1px solid;
    grid-area: form;
    background: #e0e0e0;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const MessagesUl = styled.ul`
    padding: 0.5rem 0 1rem 0.8rem;
    height: 100%;
    overflow-y: auto;
    
    &::-webkit-scrollbar {
        width: 0.5rem;
    }
 
    ::-webkit-scrollbar-thumb {
        background: #c3c3c3;
    }
`;

const SLi = styled.li`
    list-style-type: none;
`;

const mapState = state => state.chat;

function Chat({className}){
    const dispatch = useDispatch();
    const {messages} = useSelector(mapState);
    const [form] = Form.useForm();
    const inputRef = useRef(null);

    return <div className={className}>
        <MessagesUl>
            {
                messages.map(({from, message}, index) =>
                    <SLi key={index}>
                        <span>{from}:</span> {message}
                    </SLi>
                )
            }
        </MessagesUl>
        <SForm
            form={form}
            layout={'inline'}
            onFinish={({message}) => {
                if(_.isNil(message)) return;

                dispatch(sendChatMessage(message))
                form.resetFields();
                inputRef.current.focus();
            }}
        >
            <Form.Item name={'message'}>
                <Input ref={inputRef} placeholder={"Write message"}/>
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit">Send</Button>
            </Form.Item>
        </SForm>
    </div>
}

export default styled(Chat)`
    display: grid;
    grid-template-areas: 
                        "messages"
                        "form";
    grid-template-rows: auto 3.5rem;
    height: 100%;
`;