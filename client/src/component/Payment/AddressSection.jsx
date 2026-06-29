import {
  Box,
  Button,
  Card,
  CardContent,
  Radio,
  Stack,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

const AddressSection = ({
  addresses,
  selectedAddress,
  setSelectedAddress,
}) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography
            variant="h6"
            fontWeight={600}
          >
            Delivery Address
          </Typography>

          {/* TODO:
             Open Add Address Dialog
          */}
          <Button
            variant="contained"
            onClick={() =>
              navigate("/customer/address/add")
            }
          >
            Add Address
          </Button>
        </Box>

        {addresses.length === 0 && (
          <Typography color="text.secondary">
            No address found.
          </Typography>
        )}

        <Stack spacing={2}>
          {addresses.map((address) => (
            <Card
              key={address._id}
              sx={{
                border:
                  selectedAddress === address._id
                    ? "2px solid #1976d2"
                    : "1px solid #ddd",
                cursor: "pointer",
              }}
              onClick={() =>
                setSelectedAddress(address._id)
              }
            >
              <CardContent>

                <Box
                  display="flex"
                  alignItems="flex-start"
                >
                  <Radio
                    checked={
                      selectedAddress === address._id
                    }
                  />

                  <Box flex={1}>

                    <Typography
                      fontWeight={700}
                    >
                      {address.fullName}
                    </Typography>

                    <Typography>
                      {address.mobile}
                    </Typography>

                    <Typography>
                      {address.houseNo},{" "}
                      {address.area}
                    </Typography>

                    <Typography>
                      {address.city},{" "}
                      {address.state}
                    </Typography>

                    <Typography>
                      {address.pincode}
                    </Typography>

                    <Typography>
                      {address.addressType}
                    </Typography>

                    {address.isDefault && (
                      <Typography
                        color="primary"
                        fontWeight={600}
                      >
                        Default Address
                      </Typography>
                    )}

                  </Box>

                  {/* TODO:
                     Edit Address
                  */}

                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();

                      navigate(
                        `/customer/address/edit/${address._id}`
                      );
                    }}
                  >
                    Edit
                  </Button>

                </Box>

              </CardContent>
            </Card>
          ))}
        </Stack>

      </CardContent>
    </Card>
  );
};

export default AddressSection;