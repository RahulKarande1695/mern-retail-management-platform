import { Card, CardContent, Typography } from "@mui/material";

const AnalyticsCard = ({ title, value }) => {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <CardContent>
        <Typography color="text.secondary">{title}</Typography>

        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
