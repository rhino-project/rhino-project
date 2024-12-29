import React, { useMemo } from 'react';
import { Button, Link, Form, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { FormProvider } from '@rhino-project/core/components/forms';
import { useForm } from 'react-hook-form';
import { useSignInAction } from '@rhino-project/core/queries';
import { FieldPassword, FieldString } from '../../Field';
import { useRhinoConfig } from '@rhino-project/core/config';
import { useResolver } from '@rhino-project/core/hooks';
import * as yup from 'yup';

export const SignInPage = () => {
  const { appName } = useRhinoConfig();
  const { mutate: loginMutation, isLoading, error } = useSignInAction();

  const schema = yup.object().shape({
    email: yup.string().label('Email').email().required().ensure(),
    password: yup.string().label('Password').required().ensure()
  });
  const resolver = useResolver(schema);
  const defaultValues = useMemo(() => schema.default(), [schema]);

  const methods = useForm({
    defaultValues,
    disabled: isLoading,
    // errors: reducedErrors,
    mode: 'onBlur',
    resolver
  });

  const { handleSubmit } = methods;

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
        <div className="flex flex-col gap-1">
          <h1 className="text-large font-medium">Sign in to your account</h1>
          <p className="text-small text-default-500">
            to continue to {appName}
          </p>
        </div>

        <FormProvider {...methods}>
          <Form
            className="flex flex-col gap-3"
            validationBehavior="native"
            onSubmit={handleSubmit((values) => loginMutation(values))}
          >
            <FieldString
              autoComplete="username"
              autoFocus
              isRequired
              label="Email"
              path="email"
              placeholder="Enter your email"
              type="email"
            />
            <FieldPassword
              autoComplete="current-password"
              isRequired
              label="Password"
              path="password"
              placeholder="Enter your password"
            />
            <div className="flex w-full items-center justify-between px-1 py-2">
              <Link
                className="text-default-500"
                href="/auth/forgot-password"
                size="sm"
              >
                Forgot password?
              </Link>
            </div>
            <Button className="w-full" color="primary" type="submit">
              Sign In
            </Button>
          </Form>
        </FormProvider>

        <div className="flex items-center gap-4 py-2">
          <Divider className="flex-1" />
          <p className="shrink-0 text-tiny text-default-500">OR</p>
          <Divider className="flex-1" />
        </div>
        <div className="flex flex-col gap-2">
          <Button
            startContent={<Icon icon="flat-color-icons:google" width={24} />}
            variant="bordered"
          >
            Continue with Google
          </Button>
          <Button
            startContent={
              <Icon className="text-default-500" icon="fe:github" width={24} />
            }
            variant="bordered"
          >
            Continue with Github
          </Button>
        </div>
        <p className="text-center text-small">
          Need to create an account?&nbsp;
          <Link href="#" size="sm">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};
