"use client";
import React, { useRef, useState } from 'react';
import dynamic from "next/dynamic";
import { Form } from 'antd';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const JodiEditor = ({ label, name, placeholder, required, rules }) => {
    const editor = useRef(null);
    const [content, setContent] = useState('');
    const config = {
        readonly: false,
        placeholder: 'Start typings...',
    };

    return (
        <div>
            <Form.Item name={name}
                label={label}
                placeholder={placeholder}
                required={required}
                rules={rules}
            >
                <JoditEditor
                    ref={editor}
                    config={config}
                    onBlur={(newContent) => setContent(newContent)}
                />
            </Form.Item>
        </div>
    );
};

export default JodiEditor;