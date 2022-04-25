import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Loading from '../../components/Common/Loading';
import { IShipment } from '../../lib/models/shipment';

type TableProps = {
    shipments: IShipment[],
    isAdmin: Boolean
}

const initialColumns: GridColDef[] = [
    { field: '_id', headerName: 'ID', flex: 1 },
    { field: 'source', headerName: 'Source', flex: 1 },
    { field: 'destination', headerName: 'Destination', flex: 1 },
];

const adminColumns: GridColDef[] = [
    { field: 'customer', headerName: 'Customer', flex: 1, valueFormatter: params => params.value.email },
    { field: 'deliveryPartner', headerName: 'Delivery Partner', flex: 1, valueFormatter: params => params.value.email },
];

const ShipmentsGrid: React.FC<TableProps> = ({ isAdmin, shipments }) => {
    const [columns] = React.useState(() => {
        return isAdmin ? [...initialColumns, ...adminColumns] : initialColumns;
    })
    return (
        <div style={{ height: 500, width: '100%' }}>
            {!shipments ? <Loading /> : <DataGrid
                pageSize={5}
                getRowId={(r) => r._id}
                rows={shipments}
                columns={columns}
                checkboxSelection
                rowsPerPageOptions={[5]}
            />}
        </div>
    )
};

export default ShipmentsGrid;