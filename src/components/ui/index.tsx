import React from 'react';
import clsx from 'clsx';

// CARD
export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={clsx("bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden", className)}>
        {children}
    </div>
);

// BUTTON
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}
export const Button = ({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) => {
    const variants = {
        primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm",
        secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
        danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100"
    };
    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base"
    };
    return (
        <button
            className={clsx("rounded-lg font-medium transition-colors flex items-center justify-center gap-2", variants[variant], sizes[size], className)}
            {...props}
        />
    );
};

// BADGE
export const Badge = ({ children, variant = 'gray' }: { children: React.ReactNode; variant?: 'blue' | 'green' | 'red' | 'gray' | 'yellow' }) => {
    const colors = {
        blue: "bg-blue-50 text-blue-700 border-blue-200",
        green: "bg-green-50 text-green-700 border-green-200",
        red: "bg-red-50 text-red-700 border-red-200",
        gray: "bg-gray-100 text-gray-700 border-gray-200",
        yellow: "bg-yellow-50 text-yellow-700 border-yellow-200"
    };
    return (
        <span className={clsx("px-2.5 py-0.5 rounded-full text-xs font-medium border", colors[variant])}>
            {children}
        </span>
    );
};

// TABLE
export const Table = ({ headers, children }: { headers: string[]; children: React.ReactNode }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                    {headers.map((h, i) => (
                        <th key={i} className="px-6 py-3 font-semibold text-gray-900">{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {children}
            </tbody>
        </table>
    </div>
);

// MODAL
export const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};
