import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  loadProductInfo,
  editProduct,
  startBid,
  stopBid,
} from "../../store/adminSlice";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { StaticDateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Paper from "@mui/material/Paper";
import {
  openSuccessSnackbar,
  openErrorSnackbar,
  openAdminModal,
  closeAdminModal,
} from "../../store/modalSlice";
import "../styles/pages/producteditpage.scss";
import Carousel from "react-material-ui-carousel";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import dayjs from "dayjs";

const ProductPage = () => {
  const dispatch = useDispatch();
  const productInfo = useSelector((state) => state.admin.productInfo);

  const { id } = useParams();

  const [selectedDate, handleDateChange] = useState(dayjs());
  const [name, setName] = useState(null);
  const [bids, setBids] = useState([]);
  const [isBidding, setIsBidding] = useState(false);
  const [autoupdate, refresh] = useState(0);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    display: "flex",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    dispatch(loadProductInfo(id));
    console.log(productInfo);
    setIsBidding(productInfo?.isBidding);
    setBids(productInfo?.bids?.sort((a, b) => a.price - b.price));
  }, [autoupdate]);

  const editProductInfo = () => {
    dispatch(
      editProduct({
        id: id,
      })
    ).then((data) => {
      if (data.type === "admin/editProduct/fulfilled") {
        dispatch(openSuccessSnackbar("Product edited successfully"));
        dispatch(closeAdminModal());
      }
      if (data.type === "admin/editProduct/rejected") {
        dispatch(openErrorSnackbar(data.error.message));
        dispatch(closeAdminModal());
      }
    });
  };

  const onClickEdit = () => {
    dispatch(
      openAdminModal({
        text: `Edit product ${name}`,
        callback: editProductInfo,
      })
    );
  };

  const startBidding = () => {
    console.log(selectedDate.toString());
    dispatch(startBid(id));
    refresh(autoupdate + 1);
    handleClose();
  };

  const stopBidding = () => {
    dispatch(stopBid(id));
    refresh(autoupdate + 1);
  };

  const indicators = [];
  const imageGallery = [];

  productInfo?.images.forEach((image) => {
    imageGallery.push(image);
    indicators.push(<img width="48px" src={image} />);
  });

  console.log(productInfo);

  return (
    <div className="producteditpage">
      <div className="page-header">
        <h2>
          Product <span>#{id}</span>
        </h2>
      </div>
      {productInfo && (
        <div className="page-main-content">
          <div className="editproduct-wrapper">
            <div className="flex flex-row editproduct">
              <div className="flex-1">
                <div className="mb-4 editproduct-header">
                  {productInfo.name}
                </div>
                <Carousel
                  animation="slide"
                  autoPlay={false}
                  IndicatorIcon={indicators}
                  navButtonsAlwaysVisible={true}
                  fullHeightHover={false}
                  navButtonsWrapperProps={{
                    style: { height: "auto" },
                  }}
                  navButtonsProps={{
                    style: {
                      backgroundColor: "#9D9EA2",
                      color: "white",
                    },
                  }}
                  indicatorIconButtonProps={{
                    style: {
                      backgroundColor: "#F4F4F4",
                      width: "64px",
                      height: "64px",
                      borderRadius: "8px",
                    },
                  }}
                  activeIndicatorIconButtonProps={{
                    style: {
                      border: "1px solid #17af26",
                    },
                  }}
                  indicatorContainerProps={{
                    style: {
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "25px",
                      gap: "16px",
                    },
                  }}
                >
                  {productInfo.images.map((item, i) => (
                    <ImageItem key={i} item={item} />
                  ))}
                </Carousel>
              </div>
              <div className="flex flex-col items-center justify-start flex-1 mt-12">
                {productInfo.isBidding ? (
                  <>
                    <button
                      className="px-4 py-2 font-bold text-white transition-all bg-red-700 rounded-md hover:py-3 hover:px-5"
                      onClick={() => {
                        if (confirm("Are you sure to stop bidding?"))
                          stopBidding();
                      }}
                    >
                      Stop Bidding
                    </button>
                    <TableContainer component={Paper} className="mt-4">
                      <Table
                        sx={{ width: "100%" }}
                        aria-label="simple table"
                        className="max-h-[700px] overflow-scroll"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">Vendor</TableCell>
                            <TableCell align="center">Price</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {bids?.map((bid) => (
                            <TableRow
                              key={bid.vendor_id}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                {bid.vendor}
                              </TableCell>
                              <TableCell align="right">{bid.price}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                ) : (
                  <>
                    <button
                      className="px-4 py-2 font-bold text-white transition-all bg-green-700 rounded-md hover:py-3 hover:px-5"
                      onClick={handleOpen}
                    >
                      Start Bidding
                    </button>
                    <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={style} className="flex-col">
                        <h4>Ending Time</h4>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <StaticDateTimePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                          />
                        </LocalizationProvider>

                        <button
                          className="px-4 py-2 text-white bg-blue-500 rounded-md "
                          onClick={() => {
                            if (confirm("Are you sure to start bidding?"))
                              startBidding();
                          }}
                        >
                          Confirm
                        </button>
                      </Box>
                    </Modal>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function ImageItem(props) {
  return (
    <div className="currentimage">
      <img className="currentimage-img" src={props.item} />
    </div>
  );
}
export default ProductPage;
