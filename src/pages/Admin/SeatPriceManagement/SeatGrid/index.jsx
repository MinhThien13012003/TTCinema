import { Button, Box, Tooltip } from "@mui/material";

const SeatGrid = ({ room, seats, seatTypes, onSelectSeat, onAddSeat }) => {
  const rows = room?.rows;
  const cols = room?.columns;
  const columnFromSeat = (seatNumber) => {
    const match = seatNumber.match(/[A-Z](\d+)/i);
    return match ? parseInt(match[1]) : null;
  };
  const seatMap = {};
  seats.forEach((seat) => {
    const column = columnFromSeat(seat.seatNumber);
    const key = `${seat.row}-${column}`;
    seatMap[key] = seat;
  });

  const seatTypeMap = {};
  seatTypes.forEach((type) => {
    seatTypeMap[type._id] = type;
  });

  const seatTypeColorMap = {};
  seatTypes.forEach((type) => {
    seatTypeColorMap[type._id] = type.color || "gray";
    // console.log("mau ghe", seatTypeColorMap);
  });
  return (
    <Box display="inline-block" p={2} border="1px solid #ccc" borderRadius={2}>
      {Array.from({ length: rows }, (_, rowIdx) => {
        const rowChar = String.fromCharCode(65 + rowIdx); // A, B, C...

        return (
          <Box key={rowChar} display="flex" justifyContent="center" mb={1}>
            {Array.from({ length: cols }, (_, colIdx) => {
              const colNum = colIdx + 1;
              const key = `${rowChar}-${colNum}`;
              const seat = seatMap[key];

              const seatType =
                seat?.seatTypeId && seatTypeMap[seat.seatTypeId._id];

              const bgColor = seat
                ? seatTypeColorMap[seatType?._id] || "gray"
                : "#e0e0e0";
              return (
                <Box key={key} display="inline-block">
                  <Tooltip
                    title={
                      seat
                        ? `${seat.seatNumber} - ${seatType?.name || "Chưa rõ"}`
                        : `Thêm ghế tại ${rowChar}${colNum}`
                    }
                  >
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        console.log("sear: ", seat);
                        seat
                          ? onSelectSeat(seat)
                          : onAddSeat({ row: rowChar, column: colNum });
                      }}
                      sx={{
                        minWidth: 40,
                        height: 40,
                        m: 0.5,
                        backgroundColor: bgColor,
                        color: seat ? "white" : "#333",
                      }}
                    >
                      {seat ? seat.seatNumber : "+"}
                    </Button>
                  </Tooltip>
                </Box>
              );
            })}
          </Box>
        );
      })}
    </Box>
  );
};

export default SeatGrid;
