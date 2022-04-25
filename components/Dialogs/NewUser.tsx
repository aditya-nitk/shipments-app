import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { fetcher } from '../../lib/helpers/fetcher';

type DialogProps = {
    isOpen: boolean,
    isCustomer?: boolean,
    isDeliveryPartner?: boolean,
    onCreate: (id: string) => void,
    onClose: React.ReactEventHandler<{}>,
}

type FormValues = {
    email: string;
    password: string;
};

const NewCustomerDialog: React.FC<DialogProps> = ({ isOpen, isCustomer, isDeliveryPartner, onClose, onCreate }) => {
    const { register, handleSubmit, formState: { errors }, clearErrors, reset } = useForm<FormValues>();
    const onSubmit = handleSubmit(async (data) => {
       const newUser = await fetcher('/api/users', {
           method: 'POST',
           body: JSON.stringify({
               email: data.email,
               password: data.password,
               roles: {
                 isCustomer,
                 isDeliveryPartner
               }
           })
       });
       if (newUser?.id) {
         onCreate(newUser?.id);
       }
    })

    React.useEffect(() => {
        if (!isOpen) {
            reset();
            clearErrors();
        }
    }, [isOpen])

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <form onSubmit={onSubmit}>
                <DialogTitle>New {isCustomer ? 'Customer' : isDeliveryPartner ? 'Delivery Partner' : null}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        error={!!errors.email}
                        helperText={errors.email ? 'Invalid email' : undefined}
                        {...register('email', { required: true })}
                    />
                    <TextField
                        fullWidth
                        type="text"
                        margin="dense"
                        id="password"
                        label="Password"
                        variant="standard"
                        error={!!errors.password}
                        helperText={errors.password ? 'Invalid password' : undefined}
                        {...register('password', { required: true })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit">Create</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default NewCustomerDialog;