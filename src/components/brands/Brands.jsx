import React, {useState,useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import MasterLayout from '../MasterLayout';
import {fetchBrands} from '../../store/action/brandsAction';
import ReactDataTable from '../../shared/table/ReactDataTable';
import ActionButton from '../../shared/action-buttons/ActionButton';
import DeleteBrands from './DeleteBrands';
import user from '../../assets/images/brand_logo.png';
import CreateBrands from './CreateBrands';
import EditBrands from './EditBrands';
import TabTitle from '../../shared/tab-title/TabTitle';
import {getFormattedMessage, placeholderText} from '../../shared/sharedMethod';
import { Tokens } from '../../constants';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import { Permissions } from '../../constants';
import { fetchConfig } from '../../store/action/configAction';
const Brands = () => {
    const {brands, totalRecord, isLoading, isCallBrandApi,allConfigData} = useSelector(state => state);
    const Dispatch = useDispatch();
    const {config} = useSelector(
        (state) => state
    );
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [edit, setEdit] = useState(false);
    const [brand, setBrand] = useState();
    const updatedLanguage = localStorage.getItem(Tokens.UPDATED_LANGUAGE)
    
    useEffect(()=>{
       Dispatch(fetchConfig());
    },[]);
    const handleClose = (item) => {
        setEdit(!edit);
        setBrand(item);
    };

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const onChange = (filter) => {
        Dispatch(fetchBrands(filter, true));
    };

    const itemsValue = brands.length >= 0 && brands.map(item => ({
        name: item.attributes.name,
        image: item.attributes.image,
        product_count: item.attributes.product_count,
        id: item.id
    }));

    const columns = [
        {
            name: getFormattedMessage('brand.table.brand-name.column.label'),
            selector: row => row.name,
            sortable: true,
            sortField: 'name',
            cell: row => {
                const imageUrl = row.image ? row.image : user;
                return (
                    <div className='d-flex align-items-center'>
                        <div className='me-2'>
                            <img src={imageUrl} height='50' width='50' alt='Brand Image'
                                 className='image image-circle image-mini'/>
                        </div>
                        <div className='d-flex flex-column'>
                            <span>{row.name}</span>
                        </div>
                    </div>
                )
            },
        },
        {
            name: getFormattedMessage('brand.table.product-count.column.label'),
            selector: row => row.product_count,
            style: updatedLanguage === 'ar' ? {paddingRight: '87px'} : {paddingLeft: '130px'},
        },
        {
            name: getFormattedMessage('react-data-table.action.column.label'),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: row => <ActionButton item={row} goToEditProduct={handleClose} 
            isEditMode={config && config.includes(Permissions.EDIT_BRAND)?true:false}
            isDeleteMode={config && config.includes(Permissions.DELETE_BRAND)?true:false}           
            onClickDeleteModel={onClickDeleteModel}/>
        }
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText('brands.title')}/>
            <ReactDataTable columns={columns} items={itemsValue} onChange={onChange} 
            AddButton={config && config.includes(Permissions.CREATE_BRAND)?<CreateBrands/>:""}

                            totalRows={totalRecord} isLoading={isLoading} isCallBrandApi={isCallBrandApi}/>
            <EditBrands handleClose={handleClose} show={edit} brand={brand}/>
            <DeleteBrands onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel} onDelete={isDelete}/>
        </MasterLayout>
    )
};

export default Brands;

