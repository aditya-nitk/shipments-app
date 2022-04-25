import * as React from 'react';
import useSWR, {mutate} from 'swr';
import { Box, Tab, Tabs, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';
import TabPanel from '../components/Common/TabPanel';
import NewUserDialog from '../components/Dialogs/NewUser';
import UsersGrid from '../components/DataGrids/UsersGrid';
import ShipmentsGrid from '../components/DataGrids/ShipmentsGrid';
import NewShipmentDialog from '../components/Dialogs/NewShipment';
import { fetcher } from '../lib/helpers/fetcher';

type DialogState = {
    newCustomer: boolean,
    newShipment: boolean,
    newDeliveryPartner: boolean,
}

const useStyles = makeStyles({
    btnContainer: {
        width:'100%',
        display: 'flex',
        justifyContent: 'flex-end'
    }
})

const AdminPortal = () => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = React.useState(0);
  const [dialogState, setDialogState] = React.useState<DialogState>({
      newCustomer: false,
      newShipment: false,
      newDeliveryPartner: false
  });

  const { data, mutate: shipmentsMutate } = useSWR('/api/shipments', fetcher);
  const { data: customers, mutate: customersMutate } = useSWR('/api/users?role=customer', fetcher);
  const { data: deliveryPartners, mutate: dpMutate } = useSWR('/api/users?role=delivery-partner', fetcher);

  const handleChange = React.useCallback((event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  }, []);

  const closeShipmentsDialog = React.useCallback(() => {
      setDialogState({
          ...dialogState,
          newShipment: false
      })
  }, []);

  const closeCustomerDialog = React.useCallback(() => {
      setDialogState({
          ...dialogState,
          newCustomer: false
      })
  }, []);

  const closeDeliveryPartnerDialog = React.useCallback(() => {
      setDialogState({
          ...dialogState,
          newDeliveryPartner: false
      })
  }, []);

  return (
      <Box sx={{ width: '100%', p: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleChange} aria-label="admin tabs">
            <Tab label="Shipments" />
            <Tab label="Customers" />
            <Tab label="Delivery Partners" />
          </Tabs>
        </Box>
        {[
            <>
                <Box className={classes.btnContainer}>
                    <Button
                        sx={{ mb: 2 }}
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setDialogState({
                                ...dialogState,
                                newShipment: true
                            })
                        }}
                    >
                        New Shipment
                    </Button>
                </Box>
                <ShipmentsGrid isAdmin shipments={data?.shipments} />
                <NewShipmentDialog
                    customers={customers?.users}
                    deliveryPartners={deliveryPartners?.users}
                    isOpen={dialogState.newShipment}
                    onCreate={() => {
                        shipmentsMutate()
                        closeShipmentsDialog();
                    }}
                    onClose={() => {
                        closeShipmentsDialog();
                    }}
                />
            </>,
            <>
                <Box className={classes.btnContainer}>
                    <Button
                        sx={{ mb: 2 }}
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setDialogState({
                                ...dialogState,
                                newCustomer: true
                            })
                        }}
                    >
                        New Customer
                    </Button>
                </Box>
                <UsersGrid users={customers?.users} />
                <NewUserDialog
                    isCustomer
                    isOpen={dialogState.newCustomer}
                    onCreate={() => {
                        customersMutate();
                        closeCustomerDialog();
                    }}
                    onClose={() => {
                        closeCustomerDialog();
                    }}
                />
            </>,
            <>
                <Box className={classes.btnContainer}>
                    <Button
                        sx={{ mb: 2 }}
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setDialogState({
                                ...dialogState,
                                newDeliveryPartner: true
                            })
                        }}
                    >
                        New Delivery Partner
                    </Button>
                </Box>
                <UsersGrid users={deliveryPartners?.users} />
                <NewUserDialog
                    isDeliveryPartner
                    isOpen={dialogState.newDeliveryPartner}
                    onCreate={() => {
                        dpMutate();
                        closeDeliveryPartnerDialog();
                    }}
                    onClose={() => {
                        closeDeliveryPartnerDialog();
                    }}
                />
            </>
        ].map((component, i) => (
            <TabPanel key={i} value={activeTab} index={i}>
                {component}
            </TabPanel>
        ))}
      </Box>
  )
}

export default AdminPortal;