import gql from 'graphql-tag'
import { useContext, useEffect, useState } from 'react'

import {
  Dialog,
  PaymentForm,
  Translate,
  useStep,
  ViewerContext,
} from '~/components'

import { PAYMENT_CURRENCY as CURRENCY } from '~/common/enums'
import { analytics } from '~/common/utils'

import { PayTo_payTo_transaction as PayToTx } from '~/components/GQL/mutations/__generated__/PayTo'
import { UserDonationRecipient } from './__generated__/UserDonationRecipient'

type Step =
  | 'setAmount'
  | 'addCredit'
  | 'complete'
  | 'confirm'
  | 'processing'
  | 'resetPassword'
  | 'setPaymentPassword'

interface SetAmountCallbackValues {
  amount: number
  currency: CURRENCY
}

interface SetAmountOpenTabCallbackValues {
  window: Window
  transaction: PayToTx
}

interface DonationDialogProps {
  children: ({ open }: { open: () => void }) => React.ReactNode
  completeCallback?: () => void
  defaultStep?: Step
  recipient: UserDonationRecipient
  targetId: string
}

const fragments = {
  recipient: gql`
    fragment UserDonationRecipient on User {
      id
      avatar
      displayName
      liker {
        likerId
        civicLiker
      }
    }
  `,
}

const BaseDonationDialog = ({
  children,
  completeCallback,
  defaultStep = 'setAmount',
  recipient,
  targetId,
}: DonationDialogProps) => {
  const viewer = useContext(ViewerContext)

  const [showDialog, setShowDialog] = useState(true)
  const { currStep, prevStep, goForward, goBack } = useStep<Step>(defaultStep)
  const [windowRef, setWindowRef] = useState<Window | undefined>(undefined)

  const [amount, setAmount] = useState<number>(0)
  const [currency, setCurrency] = useState<CURRENCY>(CURRENCY.HKD)
  const [payToTx, setPayToTx] = useState<Omit<PayToTx, '__typename'>>()

  const open = () => {
    goForward(defaultStep)
    setShowDialog(true)
  }

  const close = () => {
    setCurrency(CURRENCY.HKD)
    setShowDialog(false)
  }

  const setAmountCallback = (values: SetAmountCallbackValues) => {
    setAmount(values.amount)
    setCurrency(values.currency)
    if (values.currency === CURRENCY.HKD) {
      goForward(
        viewer.status?.hasPaymentPassword ? 'confirm' : 'setPaymentPassword'
      )
    }
  }

  const setAmountOpenTabCallback = (values: SetAmountOpenTabCallbackValues) => {
    setWindowRef(values.window)
    setPayToTx(values.transaction)
    goForward('processing')
  }

  const switchToLike = () => {
    setAmount(160)
    setCurrency(CURRENCY.LIKE)
    goForward('setAmount')
  }

  const switchToAddCredit = () => {
    goForward('addCredit')
  }

  const ContinueDonationButton = (
    <Dialog.Footer.Button
      type="button"
      bgColor="green"
      textColor="white"
      onClick={() => goForward('confirm')}
    >
      <Translate zh_hant="回到交易" zh_hans="回到交易" />
    </Dialog.Footer.Button>
  )

  /**
   * Donation
   */
  // complete dialog for donation
  const isComplete = currStep === 'complete'
  // set donation amount
  const isSetAmount = currStep === 'setAmount'
  // confirm donation amount
  const isConfirm = currStep === 'confirm'
  // processing
  const isProcessing = currStep === 'processing'

  /**
   * Add Credit
   */
  const isAddCredit = currStep === 'addCredit'

  /**
   * Password
   */
  const isResetPassword = currStep === 'resetPassword'
  const isSetPaymentPassword = currStep === 'setPaymentPassword'

  const isHKD = currency === CURRENCY.HKD

  useEffect(() => {
    analytics.trackEvent('view_donation_dialog', { step: currStep })
  }, [currStep])

  return (
    <>
      {children({ open })}

      <Dialog size="sm" isOpen={showDialog} onDismiss={close} fixedHeight>
        <Dialog.Header
          close={close}
          leftButton={
            prevStep ? <Dialog.Header.BackButton onClick={goBack} /> : <span />
          }
          rightButton={
            <Dialog.Header.CloseButton close={close} textId="close" />
          }
          title={
            isAddCredit
              ? 'topUp'
              : isSetPaymentPassword
              ? 'paymentPassword'
              : isResetPassword
              ? 'resetPaymentPassword'
              : 'donation'
          }
        />

        {isSetAmount && (
          <PaymentForm.PayTo.SetAmount
            close={close}
            defaultCurrency={currency}
            openTabCallback={setAmountOpenTabCallback}
            recipient={recipient}
            submitCallback={setAmountCallback}
            switchToAddCredit={switchToAddCredit}
            targetId={targetId}
          />
        )}

        {isConfirm && (
          <PaymentForm.PayTo.Confirm
            amount={amount}
            currency={currency}
            recipient={recipient}
            submitCallback={() => goForward(isHKD ? 'complete' : 'processing')}
            switchToAddCredit={switchToAddCredit}
            switchToLike={switchToLike}
            targetId={targetId}
          />
        )}

        {isProcessing && (
          <PaymentForm.Processing
            nextStep={() => goForward('complete')}
            txId={payToTx?.id || ''}
            windowRef={windowRef}
          />
        )}

        {isComplete && (
          <PaymentForm.PayTo.Complete
            amount={amount}
            callback={completeCallback}
            currency={currency}
            recipient={recipient}
          />
        )}

        {isSetPaymentPassword && (
          <PaymentForm.SetPassword
            submitCallback={() => goForward('confirm')}
          />
        )}

        {/* below steps for add credit */}
        {isAddCredit && (
          <PaymentForm.AddCredit callbackButtons={ContinueDonationButton} />
        )}

        {/* below steps for password management */}
        {isResetPassword && (
          <PaymentForm.ResetPassword
            callbackButtons={ContinueDonationButton}
            close={close}
          />
        )}
      </Dialog>
    </>
  )
}

export const DonationDialog = (props: DonationDialogProps) => (
  <Dialog.Lazy mounted={<BaseDonationDialog {...props} />}>
    {({ open }) => <>{props.children({ open })}</>}
  </Dialog.Lazy>
)

DonationDialog.fragments = fragments
