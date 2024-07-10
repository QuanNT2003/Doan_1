import React, { useContext, useEffect, useState } from 'react';
import logo from '~/assets/images/logo.png'
import Input from '~/components/Input';
import { ToastContext } from '~/components/ToastContext';
import ModalLoading from '~/components/ModalLoading';
import { useNavigate } from 'react-router-dom';
import * as AdminServices from '~/apiServices/adminServices'
function Login_Admin() {
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState('')
    const onChangeEmail = (value) => {
        setEmail(value);
        setErrorEmail('')
    };
    const [errorEmail, setErrorEmail] = useState('');
    const [password, setPassword] = useState('')
    const [errorPass, setErrorPass] = useState('');
    const onChangePass = (value) => {
        setPassword(value);
        setErrorPass('')
    };

    const login = async () => {
        if (email === '') {
            toastContext.notify('error', 'Chưa nhập email');
            setErrorEmail('Không được để trống')
        }
        else if (password === '') {
            toastContext.notify('error', 'Chưa nhập mật khẩu');
            setErrorPass('Không được để trống')
        }
        else {
            setLoading(true)
            const obj = {
                email: email,
                password: password
            }
            const result = await AdminServices.login(obj)
                .catch((error) => {
                    console.log(error);
                    toastContext.notify('error', 'Email hoặc mật khẩu không đúng');
                    setLoading(false);
                });

            if (result) {
                setLoading(false);
                console.log(result)
                if (result.status === 'ERR') toastContext.notify('error', 'Email hoặc mật khẩu không đúng');
                else {
                    if (result.data.active === false) toastContext.notify('error', 'Tài khoản đã bị khóa');
                    else {
                        window.localStorage.setItem('admin', JSON.stringify(result.data));
                        window.localStorage.setItem('AdminLogin', true);
                        toastContext.notify('success', 'Đăng nhập thành công');
                        navigate('/products');
                    }

                }

            }

        }
    }
    return (
        <div className='bg-[#e9ecef] flex flex-col h-lvh justify-center'
        >
            <div className='flex justify-center items-center py-10'>
                <div className='bg-white rounded-3xl min-h-[500px] md:w-[60%] w-[90%] p-3 shadow-2xl'>
                    <div className='flex justify-center items-center'>
                        <img src={logo} className='w-[100px] me-3' alt='' />
                        <h1>TQ Shop</h1>
                    </div>
                    <div className='flex justify-center items-center my-5 font-semibold text-[24px] mx-4'>
                        TQShop - Admin
                    </div>
                    <div className='mx-3 my-7'>
                        <Input
                            placeholder="Nhập email"
                            value={email}
                            title="Nhập email"
                            required
                            error={errorEmail}
                            onChange={(value) => onChangeEmail(value)}
                        />
                    </div>
                    <div className='mx-3 my-7'>
                        <Input
                            placeholder="Nhập mật khẩu"
                            password
                            title="Mật khẩu"
                            value={password}
                            required
                            error={errorPass}
                            onChange={(value) => onChangePass(value)}
                        />
                    </div>
                    <div className='flex justify-end me-5 my-7'>
                        <div className=' cursor-pointer hover:text-cyan-600 font-semibold'>
                            Quên mật khẩu ?
                        </div>
                    </div>
                    <div className='flex justify-center items-center gap-5'>
                        <button className='bg-blue-500 py-4 px-3 rounded-lg min-w-[130px] text-white hover:bg-[#3a57e8] cursor-pointer' onClick={() => login()}>
                            Đăng nhập
                        </button>
                    </div>
                </div>
            </div>

            <ModalLoading open={loading} title={'Đang tải'} />
        </div >
    );
}

export default Login_Admin;