import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Loading from '../../components/Common/Loading';
import { IUser } from '../../lib/models/user';

type TableProps = {
    users?: IUser[]
}

const columns: GridColDef[] = [
    { field: '_id', headerName: 'ID', flex: 0.25 },
    { field: 'email', headerName: 'Email', flex: 1 },
];

const UsersGrid: React.FC<TableProps> = ({ users }) => {
    return (
        <div style={{ height: 500, width: '100%' }}>
            {!users ? <Loading /> : (
                <DataGrid
                    pageSize={5}
                    getRowId={(r) => r._id}
                    rows={users}
                    columns={columns}
                    checkboxSelection
                    rowsPerPageOptions={[5]}
                />
            )}
        </div>
    )
};

export default UsersGrid;