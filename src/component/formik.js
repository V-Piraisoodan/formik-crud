import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik } from 'formik';

export default function Product() {
    const [formvalues,setFormvalues]=useState({});
    // const [initialValue,setInitialvalue] = useState({});
    const [field, setField] = useState({
        user:[],
    })
    const initialValue = {
        id:'',
        productId: '',
        productName: '',
        price: '',
    };

    const validate = (formData) => {
        var errors = {};
        // console.log(formData)
        if (formData.id === '') errors.id = '*Required field';
        if (formData.productId === '') errors.productId = '*Required field';
        if (formData.productName === '') errors.productName = '*Required field';
        if (formData.price === '') errors.price = '*Required field';
        return errors;
    };
    const onPopulateData=async (id)=>{
        const selectedData=field.user.filter((data)=>data.id==id)[0];
        await setFormvalues({
        id:selectedData.id,
        productId:selectedData.productId,
        productName:selectedData.productName,
        price:selectedData.price,})
    }
    const handleSubmit = async (formData,{resetForm}) => {
        if(formvalues.id){
            //Update part
            var res=await axios.put(`https://62dd3993ccdf9f7ec2c27434.mockapi.io/formik/${formvalues.id}`,
                {productId:formData.productId,
                productName:formData.productName,
                price:formData.price,});
                
            var index=field.user.findIndex(row=>row.id==res.data.id);
            var user=[...field.user]
            user[index]=res.data;
            await setField({user})
            //formData
            formData.productId='';formData.productName='';formData.price='';formData.id=''; 
            await setFormvalues({});
            resetForm();             
        }
        else{
            //create part
            var res=await axios.post('https://62dd3993ccdf9f7ec2c27434.mockapi.io/formik/',
            {productId:formData.productId,
             productName:formData.productName,
             price:formData.price,});
            
            var user=[...field.user]
            user.push(res.data);
            await setField({user})
            formData.productId='';formData.productName='';formData.price='';
            await setFormvalues({});
            resetForm({});  
        }  
    };
    const handleDelete= async (id)=>{
        await axios.delete(`https://62dd3993ccdf9f7ec2c27434.mockapi.io/formik/${id}`)
        var user=field.user.filter((row)=>row.id!=id)
        setField({user})
    }
    useEffect(async () => {
        var res = await axios.get('https://62dd3993ccdf9f7ec2c27434.mockapi.io/formik/');
        setField({user:res.data});
        console.log(field.user);
    }, []);

    return (
        <div className='container'>
            <div className='input-container'>
                <span className='input-tittle'> FORMIK CRUD </span>
                <Formik
                    initialValues={formvalues || initialValue}
                    validate={(formData) => validate(formData)}
                    onSubmit={(formData,{resetForm}) => handleSubmit(formData,{resetForm})}
                    enableReinitialize>
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        resetForm
                        /* and other goodies */
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <div className='input-div'>
                                <label className='input-label'> Product ID: </label><br/>
                                <input
                                    className='input-box'
                                    type="text"
                                    name="productId"
                                    value={values.productId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                
                                <span className='error'>
                                    {touched.productId && errors.productId}
                                </span>
                            </div>
                            <div className='input-div'>
                                <label className='input-label'> Product Name: </label><br/>
                                <input
                                    className='input-box'
                                    type="text"
                                    name="productName"
                                    value={values.productName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <br/>
                                <span className='error'>
                                    {touched.productName && errors.productName}
                                </span>
                            </div>
                            
                            <div className='input-div'>
                                <label className='input-label'> Price: </label><br/>
                                <input
                                    className='input-box'
                                    type="text"
                                    name="price"
                                    value={values.price}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <br/>
                                <span className='error'>
                                    {touched.price && errors.price}
                                </span>
                            </div>
                            
                            <div className='buttons'>
                                <button className='submit' type="submit" disabled={isSubmitting}>Submit</button>
                                <button className='reset' type="reset" onClick={resetForm}>Reset</button>  
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
            <br/><br/>
            <div className='table-container'>
                <table className='table'>
                    <thead>
                        <tr className='t-head'>
                            <td className='heading'>S.No</td>
                            <td className='heading'>Product Id</td>
                            <td className='heading'>Product Name</td>
                            <td className='heading'>Price</td>
                            <td className='heading'>Actions</td>
                        </tr>
                    </thead>
                    <tbody>
                        {field.user.map((row=>{
                           return(
                                <tr key={row.id}>
                                <td className='table-value'>{row.id}</td>
                                <td className='table-value'>{row.productId}</td>
                                <td className='table-value'>{row.productName}</td>
                                <td className='table-value'>Rs.{row.price}</td>
                                <td className='buttons1'><button className='edit' onClick={()=>onPopulateData(row.id)}>Edit</button> &nbsp;
                                <button className='delete' onClick={()=>handleDelete(row.id)}>Delete</button></td>
                            </tr>
                            )
  
                        }))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}