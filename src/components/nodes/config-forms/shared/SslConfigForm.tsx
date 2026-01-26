import React from 'react';
import { VariableInput } from '../../../../components/common/variable-input/VariableInput';

export interface SslConfigValues {
    truststoreLocation?: string;
    truststorePassword?: string;
    keystoreLocation?: string;
    keystorePassword?: string;
}

interface SslConfigFormProps {
    values: SslConfigValues;
    onChange: (field: keyof SslConfigValues, value: string) => void;
    accentColor: string;
}

export const SslConfigForm: React.FC<SslConfigFormProps> = ({ values, onChange, accentColor }) => {
    const focusClass = `focus-within:ring-[${accentColor}]/20 focus-within:border-[${accentColor}]`;

    return (
        <div className="grid grid-cols-2 gap-2">
            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Truststore Location</label>
                <VariableInput
                    small
                    value={values.truststoreLocation || ''}
                    onValueChange={(val) => onChange('truststoreLocation', val)}
                    placeholder="/path/to/truststore.jks"
                    className={`bg-slate-50 border border-slate-200 text-[11px] ${focusClass}`}
                />
            </div>
            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Truststore Password</label>
                <VariableInput
                    small
                    type="password"
                    value={values.truststorePassword || ''}
                    onValueChange={(val) => onChange('truststorePassword', val)}
                    className={`bg-slate-50 border border-slate-200 text-[11px] ${focusClass}`}
                />
            </div>
            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Keystore Location</label>
                <VariableInput
                    small
                    value={values.keystoreLocation || ''}
                    onValueChange={(val) => onChange('keystoreLocation', val)}
                    placeholder="/path/to/keystore.jks"
                    className={`bg-slate-50 border border-slate-200 text-[11px] ${focusClass}`}
                />
            </div>
            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Keystore Password</label>
                <VariableInput
                    small
                    type="password"
                    value={values.keystorePassword || ''}
                    onValueChange={(val) => onChange('keystorePassword', val)}
                    className={`bg-slate-50 border border-slate-200 text-[11px] ${focusClass}`}
                />
            </div>
        </div>
    );
};
