import { Modal, Button } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';

const EmailDetails = ({ open, setOpen, details }) => {
    const [showAllRecipients, setShowAllRecipients] = useState(false);
    const maxRecipientsToShow = 4;
    
    return (
        <Modal
            open={open}
            onCancel={() => setOpen(false)}
            width={800}
            title={
                <span className='text-lg flex items-center gap-2'>
                    <span>Email Details</span>
                    <span className='text-sm mt-[3px]'>
                        ({dayjs(details?.createdAt).format('MMM D, YYYY h:mm A')})
                    </span>
                </span>
            }
            footer={null}
        >
            <div className="w-full bg-white rounded-lg mt-5 mb-5">
                <div className="mb-2">
                    <span className="font-bold">From:</span> {details?.from}
                </div>

                <div className="mb-2">
                    <span className="font-bold">To:</span>
                    <div 
                        className={`overflow-y-auto hide-scrollbar ${showAllRecipients ? 'h-[200px]' : 'h-fit'} transition-all duration-300`}
                    >
                        <ul className="list-disc pl-6">
                            {details?.to && (showAllRecipients ? details?.to : details?.to.slice(0, maxRecipientsToShow)).map((recipient, index) => (
                                <li key={index}>{recipient}</li>
                            ))}
                        </ul>
                    </div>
                    {details?.to?.length > maxRecipientsToShow && (
                        <Button 
                            type="link" 
                            onClick={() => setShowAllRecipients(!showAllRecipients)}
                        >
                            {showAllRecipients ? 'See Less' : 'See More'}
                        </Button>
                    )}
                </div>

                <div className="my-4">
                    <span className="font-bold">Subject:</span> {details?.subject}
                </div>
                <div className="mt-4 p-4 border rounded bg-gray-50">
                    <span className="font-bold">Content:</span>
                    <div className="mt-2" dangerouslySetInnerHTML={{ __html: details?.content }} />
                </div>
            </div>
        </Modal>
    );
};

export default EmailDetails;
