import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";
import { LoginHero } from "@/components/auth/login-hero";

export const metadata: Metadata = {
    title: "Login",
};

export default function LoginPage() {
    return (
        <main className="min-h-dvh bg-white lg:grid lg:grid-cols-2">
            <section className="flex min-h-dvh items-center px-5 py-10 sm:px-8 lg:px-12 xl:px-16">
                <div className="mx-auto w-full max-w-xl">
                    <p className="mb-8 text-2xl font-semibold text-[#1C64F2] lg:hidden">
                        ticktock
                    </p>
                    <LoginForm />
                </div>
            </section>

            <LoginHero />
        </main>
    );
}