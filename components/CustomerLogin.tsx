'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { User, LogIn, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { MOCK_CUSTOMERS, CUSTOMER_CREDENTIALS } from '@/utils/mockData';

// Zod validation schema for customer login
const customerLoginSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type CustomerLoginFormData = z.infer<typeof customerLoginSchema>;

type ModalKind = 'success' | 'error';

type ModalState = {
  open: boolean;
  kind: ModalKind;
  title: string;
  message: string;
  autoRedirect?: boolean;
};

// Lightweight modal (no extra deps)
const Modal: React.FC<{
  open: boolean;
  kind: ModalKind;
  title: string;
  message: string;
  onClose: () => void;
  primaryAction?: { label: string; onClick: () => void };
}> = ({ open, kind, title, message, onClose, primaryAction }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
    >
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 px-6 pt-6">
          {kind === 'success' ? (
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          ) : (
            <XCircle className="h-6 w-6 text-red-600" />
          )}
          <h3 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        <div id="modal-desc" className="px-6 py-4 text-gray-700 dark:text-gray-300">
          {message}
        </div>
        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Close
          </button>
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className={`px-4 py-2 rounded-xl text-white transition ${
                kind === 'success'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {primaryAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const CustomerLogin: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { loginCustomer } = useAuth();
  const { showToast } = useToast(); // keep if you still want toasts alongside modal
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CustomerLoginFormData>({
    resolver: zodResolver(customerLoginSchema),
  });

  const [modal, setModal] = useState<ModalState>({
    open: false,
    kind: 'success',
    title: '',
    message: '',
    autoRedirect: false,
  });

  // Optional: auto-redirect when success modal shows
  useEffect(() => {
    if (modal.open && modal.kind === 'success' && modal.autoRedirect) {
      const t = setTimeout(() => {
        router.push('/customer-dashboard');
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [modal, router]);

  const openSuccess = (msg: string, options?: { autoRedirect?: boolean }) =>
    setModal({
      open: true,
      kind: 'success',
      title: 'Login complete',
      message: msg,
      autoRedirect: options?.autoRedirect ?? false,
    });

  const openError = (msg: string) =>
    setModal({
      open: true,
      kind: 'error',
      title: 'Login failed',
      message: msg,
    });

  const closeModal = () => setModal((m) => ({ ...m, open: false }));

  const doLogin = async (username: string, password: string) => {
    setIsLoading(true);
    const success = await loginCustomer(username, password);

    if (success) {
      // Optional: keep toast if you like
      // showToast('Login successful! Redirecting...', 'success');
      openSuccess('Redirecting to your dashboard…', { autoRedirect: true });
    } else {
      // showToast('Invalid username or password. Please try again.', 'error');
      openError('Invalid username or password. Please try again.');
    }

    setIsLoading(false);
  };

  const onSubmit = async (data: CustomerLoginFormData) => {
    await doLogin(data.username, data.password);
  };

  const handleQuickLogin = async (username: string, password: string) => {
    setValue('username', username);
    setValue('password', password);
    await doLogin(username, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Modal */}
      <Modal
        open={modal.open}
        kind={modal.kind}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
        primaryAction={
          modal.kind === 'success'
            ? { label: 'Go now', onClick: () => router.push('/customer-dashboard') }
            : undefined
        }
      />

      <div className="max-w-md w-full">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Main</span>
        </Link>

        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">K</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">KRUX Finance</h1>
          <p className="text-gray-600 dark:text-gray-400">Customer Support Portal</p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Login</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                {...register('username')}
                placeholder="Enter your username"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                  errors.username 
                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                  errors.password 
                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(isLoading || isSubmitting) ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Demo Accounts */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Demo Accounts</h3>
          <div className="space-y-2">
            {MOCK_CUSTOMERS.map((customer) => (
              <button
                key={customer.id}
                onClick={() => handleQuickLogin(customer.username!, CUSTOMER_CREDENTIALS[customer.username!])}
                disabled={isLoading}
                className="w-full text-left bg-white dark:bg-gray-800 px-4 py-3 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border border-blue-200 dark:border-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="font-medium text-gray-900 dark:text-white">{customer.name}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Username: {customer.username} | Password: {CUSTOMER_CREDENTIALS[customer.username!]}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
