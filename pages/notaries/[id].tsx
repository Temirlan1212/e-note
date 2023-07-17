import { Container } from "@mui/material";
import { useRouter } from "next/router";

const NotariesDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Container>
      <h1>User Details</h1>
      <p>ID: {id}</p>
    </Container>
  );
};

export default NotariesDetailPage;
