import { json, redirect } from '@shopify/remix-oxygen';
import { Form, useActionData, useNavigation, Link } from '@remix-run/react';

// Centralised strings for future i18n
const T = {
    JA: {
        title: 'ログイン',
        email: 'メールアドレス',
        password: 'パスワード',
        submit: 'ログインする',
        submitting: '認証中...',
        error: 'メールアドレスまたはパスワードが間違っています。',
        registerLink: '新規登録はこちら',
    },
    EN: {
        title: 'Login',
        email: 'Email',
        password: 'Password',
        submit: 'Sign In',
        submitting: 'Authenticating...',
        error: 'Incorrect email or password.',
        registerLink: 'Create an account',
    }
};

// Defaulting to JA for now, robust structure ready for dynamic locale extraction
const t = T.JA;

export async function action({ request, context }) {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
        return json({ error: t.error }, { status: 400 });
    }

    try {
        const { customerAccessTokenCreate } = await context.storefront.mutate(LOGIN_MUTATION, {
            variables: { input: { email, password } },
        });

        if (customerAccessTokenCreate?.customerUserErrors?.length > 0) {
            return json({ error: customerAccessTokenCreate.customerUserErrors[0].message }, { status: 401 });
        }

        const token = customerAccessTokenCreate?.customerAccessToken?.accessToken;

        // Return redirect setting cookie for token
        return redirect('/', {
            headers: {
                'Set-Cookie': `customerAccessToken=${token}; Path=/; HttpOnly; SameSite=Lax`,
            },
        });
    } catch (error) {
        return json({ error: t.error }, { status: 500 });
    }
}

export default function Login() {
    const actionData = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    return (
        <div className="min-h-screen bg-wacca-darker text-white flex flex-col items-center justify-center p-6 selection:bg-wacca-red selection:text-white" style={{ fontFamily: '"Noto Sans JP", sans-serif' }}>
            <div className="max-w-md w-full bg-wacca-darker border border-wacca-border p-8 md:p-10 rounded-2xl shadow-2xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-display font-semibold tracking-wider text-white mb-2 uppercase">LOGIN</h1>
                    <p className="text-wacca-muted text-xs font-mono tracking-widest">[ SYS_AUTH_MODULE ]</p>
                </div>

                <Form method="post" className="space-y-6">
                    {actionData?.error && (
                        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-500 text-sm font-mono text-center">
                            {actionData.error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-mono text-wacca-muted mb-2 tracking-[0.15em]">{t.email}</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full bg-[#0a0a0f] border border-wacca-border text-white px-4 py-4 rounded-xl focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-mono text-wacca-muted mb-2 tracking-[0.15em]">{t.password}</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full bg-[#0a0a0f] border border-wacca-border text-white px-4 py-4 rounded-xl focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-white text-black font-semibold py-4 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 tracking-[0.1em] text-sm mt-4"
                    >
                        {isSubmitting ? t.submitting : t.submit}
                    </button>
                </Form>

                <div className="mt-8 text-center pt-6 border-t border-[#1e1e2e]">
                    <Link to="/account/register" className="text-sm text-wacca-muted hover:text-white transition-colors tracking-wider">
                        {t.registerLink}
                    </Link>
                </div>
            </div>
        </div>
    );
}

const LOGIN_MUTATION = `#graphql
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;
