import {
  Box,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

// Order tracking flow
const steps = [
  "Placed",
  "Accepted",
  "Packed",
  "Assigned",
  "Accepted By Delivery Partner",
  "Picked Up",
  "Delivered",
];

const TrackingStepper = ({
  trackingHistory = [],
}) => {
console.log(trackingHistory,"trackingHistory")
  // Get completed statuses from tracking history
  const completedSteps =
    trackingHistory.map(
      (item) => item.status
    );

  return (
    <Box>

      <Typography
        variant="h6"
        mb={2}
      >
        Order Tracking
      </Typography>

      {steps.map((step, index) => {

        // Check whether current step is completed
        const completed =
          completedSteps.includes(step);

        return (
          <Box
            key={step}
            display="flex"
            alignItems="flex-start"
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
            >

              {/* Completed / Pending Icon */}
              {completed ? (
                <CheckCircleIcon color="success" />
              ) : (
                <RadioButtonUncheckedIcon color="disabled" />
              )}

              {/* Connector Line */}
              {index !== steps.length - 1 && (
                <Box
                  sx={{
                    width: "2px",
                    height: "45px",
                    bgcolor: completed
                      ? "green"
                      : "#ddd",
                  }}
                />
              )}

            </Box>

            <Box
              ml={2}
              mt="-2px"
            >

              {/* Step Name */}
              <Typography
                fontWeight={
                  completed ? 600 : 400
                }
                color={
                  completed
                    ? "green"
                    : "text.secondary"
                }
              >
                {step}
              </Typography>

              {/* Display completed date & time */}
              {completed && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {
                    new Date(
                      trackingHistory.find(
                        (item) =>
                          item.status === step
                      )?.updatedAt
                    ).toLocaleString()
                  }
                </Typography>
              )}

            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default TrackingStepper;