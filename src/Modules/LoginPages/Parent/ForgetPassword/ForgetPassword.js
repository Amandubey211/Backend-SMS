import React, { useState } from 'react';
import Logo from '../../../../../Components/Common/Logo';
import {useForgotPassword} from '../../../../../Hooks/AuthHooks/Student/useResetPassword';
import { LuLoader } from 'react-icons/lu';
import { NavLink, useNavigate } from 'react-router-dom';
import Layout from '../../../../../Components/Common/Layout';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const { loading,sendForgotPassword } = useForgotPassword();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendForgotPassword({ email });
      // navigate('/reset_password');
    } catch (error) {
      console.error('Failed to reset password:', error);
      alert(error.msg || 'Failed to reset password.');
    }
  };

  return (
    <Layout title="Forget Password">
      <div className="relative w-full h-full">
        <div className="absolute top-0 right-0 p-6">
          <Logo />
        </div>

        <form onSubmit={handleSubmit} className="flex justify-center w-full h-full">
          <div className="bg-white p-8 rounded-lg w-full max-w-3xl">
            <NavLink
              to="/"
              className="text-sm text-gray-500 hover:text-gray-700 mb-4 items-center flex gap-2"
            >
              <div className="rounded-full border text-xl w-6 h-6 flex justify-center items-center">
                &larr;
              </div>
              <span>LMS Home</span>
            </NavLink>
            <h2 className="text-3xl py-4 font-semibold">Forget Password</h2>

            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
            >
              {loading ? (
                <div className="flex justify-center">
                  <LuLoader className="animate-spin text-2xl" />
                </div>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ForgetPassword;
