import React, {useState,useEffect} from 'react';
import {connect,useDispatch,useSelector} from 'react-redux';
import MasterLayout from '../MasterLayout';
import {fetchCurrencies} from '../../store/action/currencyAction';
import ReactDataTable from '../../shared/table/ReactDataTable';
import DeletCurrency from './DeletCurrency';
import CreateCurrency from './CreateCurrency';
import EditCurrency from './EditCurrency';
import TabTitle from '../../shared/tab-title/TabTitle';
import {getFormattedMessage, placeholderText} from '../../shared/sharedMethod';
import ActionButton from '../../shared/action-buttons/ActionButton';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import { Permissions } from '../../constants';
import { fetchConfig } from '../../store/action/configAction';
const Currencies = (props) => {
    const {fetchCurrencies, currencies, totalRecord, isLoading,allConfigData} = props;
    const dispatch = useDispatch();
    const {config} = useSelector(
        (state) => state
    );
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [toggle, setToggle] = useState(false);
    const [currency, setCurrency] = useState();
     useEffect(()=>{
        dispatch(fetchConfig());
     },[])
    const handleClose = (item = null) => {
        setToggle(!toggle);
        setCurrency(item);
    };

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const onChange = (filter) => {
        fetchCurrencies(filter, true);
    };

    const itemsValue = currencies.length >= 0 && currencies.map(item => ({
        name: item.attributes.name,
        country_name: item.attributes.country?.name,
        code: item.attributes.code,
        symbol: item.attributes.symbol,
        id: item.id
    }));

    const columns = [
        {
            name: getFormattedMessage('globally.input.name.label'),
            selector: row => row.name,
            sortable: true,
            sortField: 'name',
        },
        {
            name: "country",
            selector: row => row.country_name,
            sortable: false,
            sortField: 'country_name',
        },
        {
            name: getFormattedMessage('currency.modal.input.code.label'),
            selector: row => row.code,
            sortField: 'code',
            sortable: true,
            cell: row => {
                return <span className='badge bg-light-info'>
                            <span>{row.code}</span>
                        </span>
            }
        },
        {
            name: getFormattedMessage('currency.modal.input.symbol.label'),
            sortField: 'symbol',
            sortable: true,
            cell: row => {
                return <span className='badge bg-light-primary'>
                            <span>{row.symbol}</span>
                        </span>
            }
        },
        {
            name: getFormattedMessage('react-data-table.action.column.label'),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: row => {
                return <ActionButton 
                item={row} goToEditProduct={handleClose} 
                // onClickDeleteModel={onClickDeleteModel}
                isEditMode={config && config.includes(Permissions.EDIT_CURRENCY)?true:false}
                isDeleteMode={false}
                // isDeleteMode={config && config.includes(Permissions.DELETE_CURRENCY)?true:false} 
                />
            }
        }
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText('currencies.title')}/>
            <ReactDataTable columns={columns} items={itemsValue} onChange={onChange} isLoading={isLoading}
                            totalRows={totalRecord} 
                            // AddButton={<CreateCurrency/>}
                            />
            <EditCurrency handleClose={handleClose} show={toggle} currency={currency}/>
            <DeletCurrency onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel} onDelete={isDelete}/>
        </MasterLayout>
    )
};

const mapStateToProps = (state) => {
    const {currencies, totalRecord, isLoading,allConfigData} = state;
    return {currencies, totalRecord, isLoading,allConfigData}
};

export default connect(mapStateToProps, {fetchCurrencies})(Currencies);

