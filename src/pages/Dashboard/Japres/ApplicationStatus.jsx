import Card from '../../../components/ui/Card.jsx'
import IconTime from '../../../assets/icons/IconTime.svg'
import IconSuccess from '../../../assets/icons/IconSuccess.svg'
import IconClose from '../../../assets/icons/IconClose.svg'

const STATUS_CONFIG = {
  NOT_SUBMITTED: {
    icon: IconClose,
    title: 'Not Submitted Yet',
    description: 'Please submit your JaPres application to proceed.',
  },
  PENDING: {
    icon: IconTime,
    title: 'Under Review',
    description:
      'Your application is being reviewed. Please wait for the result.',
  },
  UNDER_REVIEW: {
    icon: IconTime,
    title: 'Under Review',
    description:
      'Your application is being reviewed. Please wait for the result.',
  },
  REJECTED: {
    icon: IconClose,
    title: 'Application Rejected',
    description: 'Unfortunately, your application was not accepted this time.',
  },
  ACCEPTED_GOLD: {
    icon: IconSuccess,
    title: 'Accepted – 100% Discount',
    description:
      "Congratulations! You've received the highest achievement with full discount.",
  },
  ACCEPTED_SILVER: {
    icon: IconSuccess,
    title: 'Accepted – 75% Discount',
    description:
      "Congratulations! You've been accepted with a significant discount.",
  },
}

export default function ApplicationStatus({ status }) {
  // Safe Normalization (menangani "Accepted Gold", "ACCEPTED_GOLD", "Pending", "PENDING", dll)
  const normalizedKey =
    typeof status === 'string'
      ? status.trim().toUpperCase().replace(/\s+/g, '_')
      : 'NOT_SUBMITTED'

  const config = STATUS_CONFIG[normalizedKey] || STATUS_CONFIG.NOT_SUBMITTED

  return (
    <Card className="flex flex-col px-7 py-6 sm:px-14 sm:py-10 xl:px-16 xl:py-12 rounded-xl border-white border-[3px]">
      <div className="space-y-6 sm:space-y-9">
        <h2 className="text-lg font-bold sm:text-3xl w-fit">
          Application Status
        </h2>
        <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-7">
          <img src={config.icon} alt="" className="size-20 sm:size-32" />
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-semibold sm:text-3xl font-outfit">
              {config.title}
            </h3>
            <p className="text-xs sm:text-lg">{config.description}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
