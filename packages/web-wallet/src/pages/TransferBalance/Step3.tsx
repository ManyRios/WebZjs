import { useNavigate } from 'react-router-dom';
import { TransferBalanceFormType } from './useTransferBalanceForm';
import React from 'react';
import { CheckSVG, WarningSVG } from '../../assets';
import Button from '../../components/Button/Button';
import TransactionStatusCard from '../../components/TransactionStatusCard/TransactionStatusCard';

interface Step3Props {
  resetForm: TransferBalanceFormType['resetForm'];
  error?: string | Error;
}

function Step3({ resetForm, error }: Step3Props): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <>
      {error ? (
        <TransactionStatusCard
          headText="Transfer complete"
          statusMessage="Your transaction has been sent."
          icon={<WarningSVG />}
        >
          <Button
            variant="primary"
            onClick={() => resetForm()}
            label={'Try Again'}
          />
        </TransactionStatusCard>
      ) : (
        <TransactionStatusCard
          headText="Transfer complete"
          statusMessage="Your transaction has been sent."
          icon={<CheckSVG />}
        >
          <Button
            onClick={() =>
              navigate('/dashboard/account-summary', { replace: true })
            }
            label={'Back to Account Summary'}
          />
          <Button
            variant="secondary"
            classNames="border-[#0e0e0e]"
            onClick={() => resetForm()}
            label={'Make Another Transfer'}
          />
        </TransactionStatusCard>
      )}
    </>
  );
}

export default Step3;
