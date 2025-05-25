import { useParams } from 'react-router-dom';

export default function Booking() {
  const { showtimeId } = useParams();
  return <h1>Đặt vé cho suất chiếu: {showtimeId}</h1>;
}
