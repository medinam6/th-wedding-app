import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from "@/components/ui/button";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, guestName }) => {
    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent
                style={{ backgroundColor: 'rgb(238, 238, 238)' }}>
                <AlertDialogHeader>
                    <AlertDialogTitle className="font-pop text-black">Delete</AlertDialogTitle>
                    <hr style={{borderTop: '1px solid gray', paddingBottom: '1px' }}></hr>
                    <AlertDialogDescription className="font-pop text-black">
                        Are you sure you want to delete <span className="font-bold text-red-500">{guestName}</span> and all guest information?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button onClick={onClose} className="rounded-md border border-blackbg-white px-4 py-2 text-sm font-pop text-black shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{ letterSpacing: '1px' }}>CANCEL</Button>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="rounded-md border border-black bg-black px-4 py-2 text-sm font-pop text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                        style={{ letterSpacing: '1px' }}
                    >
                        DELETE
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteConfirmationModal;
