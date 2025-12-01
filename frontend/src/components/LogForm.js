import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { postEntry } from '../services/api';
import { toast } from 'react-toastify';  // assume we install react-toastify
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import Register from './Register';

const schema = yup.object().shape({
  water: yup.number().typeError('Water must be a number')
    .required('Water amount is required')
    .min(0, 'Water cannot be negative'),
  exercise: yup.number().typeError('Exercise must be a number')
    .required('Exercise time is required')
    .min(0, 'Exercise cannot be negative'),
  sugar: yup.number().typeError('Blood sugar must be a number')
    .required('Blood sugar is required')
    .min(0, 'Blood sugar cannot be negative'),
});

const LogForm = ({ onNewEntry }) => {
  const { user } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm({
    mode: 'onBlur',       // triggers validation on blur
    reValidateMode: 'onChange',  // re-validates on change
    resolver: yupResolver(schema),
    defaultValues: { water: '', exercise: '', sugar: '' },
  });

  if (!user) {
    return (
      <div>
        <p className="mb-2">You must sign in to save entries.</p>
        <div className="d-flex gap-2">
          <Login onSuccess={() => window.location.reload()} />
          <button className="btn btn-link" onClick={() => setShowRegister(s => !s)}>
            {showRegister ? 'Hide' : 'Create account'}
          </button>
        </div>
        {showRegister && <Register onSuccess={() => window.location.reload()} />}
      </div>
    );
  }

  const onSubmit = async (data) => {
    try {
      await postEntry(data);
      toast.success('Entry saved successfully');
      reset();
      if (onNewEntry) onNewEntry();
    } catch (err) {
      console.error('Submit error:', err);
      if (err.response && err.response.data && err.response.data.errors) {
        err.response.data.errors.forEach(e => {
        toast.error('${e.param}: ${e.msg}');
      });

    } else {
        toast.error('Failed to save entry. Please try again later.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="col-12">
        <label className="block font-medium">Water (ml)</label>
        <input
          type="number"
          className={`mt-1 block w-full border rounded p-2 ${
            errors.water ? 'border-red-500' : 'border-gray-300'
          }`}
          {...register('water')}
          disabled={isSubmitting}
        />
        {errors.water && <p className="text-red-600 text-sm mt-1">{errors.water.message}</p>}
      </div>

      <div className="col-12">
        <label className="block form-medium">Exercise (min)</label>
        <input
          type="number"
              className={`mt-1 block w-full border rounded p-2 ${
            errors.exercise ? 'border-red-500' : 'border-gray-300'
          }`}
          {...register('exercise')}
          disabled={isSubmitting}
        />
        {errors.exercise && <p className="invalid-feedback">{errors.exercise.message}</p>}
      </div>

      <div className="col-12">
        <label className="block font-medium">Blood Sugar (mg/dL)</label>
        <input
          type="number"
           className={`mt-1 block w-full border rounded p-2 ${
            errors.sugar ? 'border-red-500' : 'border-gray-300'
          }`}
          {...register('sugar')}
          disabled={isSubmitting}
        />
        {errors.sugar && <p className="invalid-feedback">{errors.sugar.message}</p>}
      </div>

      <div className="col-12 d-grid">
        <button
            type="submit"
            className="btn btn-primary"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? 'Saving...' : 'Save Entry'}
        </button>
      </div>
    </form>
  );
};

export default LogForm;
