import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button, FormControl, InputLabel, Select, MenuItem, TextField, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText } from '@mui/material';
import { fetcher } from '../../lib/helpers/fetcher';
import { IUser } from '../../lib/models/user';

type DialogProps = {
    isOpen: boolean,
    onCreate: (id: string) => void,
    onClose: React.ReactEventHandler<{}>,
    customers: IUser[],
    deliveryPartners: IUser[],
}

type FormValues = {
    source: string;
    destination: string;
    customer: string;
    deliveryPartner: string;
};

const NewShipmentDialog: React.FC<DialogProps> = ({ isOpen, onClose, onCreate, customers, deliveryPartners }) => {
    const { register, handleSubmit, formState: { errors }, clearErrors, reset } = useForm<FormValues>();
    const onSubmit = handleSubmit(async (data) => {
        const newShipment = await fetcher('/api/shipments', {
            method: 'POST',
            body: JSON.stringify({
                source: data.source,
                destination: data.destination,
                customerId: data.customer,
                deliveryPartnerId: data.deliveryPartner,
            })
        });
        if (newShipment?.id) {
            onCreate(newShipment?.id);
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
            <form style={{ minWidth: 550 }} onSubmit={onSubmit}>
                <DialogTitle>New Shipment</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        autoFocus
                        margin="dense"
                        id="Source"
                        label="Source"
                        type="text"
                        variant="standard"
                        error={!!errors.source}
                        helperText={errors.source ? 'Invalid source' : undefined}
                        {...register('source', { required: true })}
                    />
                    <TextField
                        fullWidth
                        type="text"
                        margin="dense"
                        id="destination"
                        label="Destination"
                        variant="standard"
                        error={!!errors.destination}
                        helperText={errors.destination ? 'Invalid destination' : undefined}
                        {...register('destination', { required: true })}
                    />
                    <FormControl fullWidth margin="dense" error={!!errors.customer}>
                        <InputLabel id="customer">Customer</InputLabel>
                        <Select
                            labelId="select-customer"
                            id="select-customer"
                            label="Customer"
                            {...register('customer', { required: true })}
                        >
                            {customers?.length ?
                                customers.map(c => <MenuItem key={c._id} value={c._id}>{c.email}</MenuItem>) :
                                []
                            }
                        </Select>
                        {!!errors.customer && <FormHelperText>Field is required!</FormHelperText>}
                    </FormControl>
                    <FormControl fullWidth margin="dense" error={!!errors.deliveryPartner}>
                        <InputLabel id="deliveryPartner">Delivery Partner</InputLabel>
                        <Select
                            labelId="select-dp"
                            id="select-dp"
                            label="Delivery Partner"
                            {...register('deliveryPartner', { required: true })}
                        >
                            {deliveryPartners?.length ?
                                deliveryPartners.map(c => <MenuItem key={c._id} value={c._id}>{c.email}</MenuItem>) :
                                []
                            }
                        </Select>
                        {!!errors.deliveryPartner && <FormHelperText>Field is required!</FormHelperText>}
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit">Create</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default NewShipmentDialog;