import { Box, Grid } from "@mui/material";
import React from "react";
import NotariesCard from "./NotariesCard";
import { INotary } from "@/models/notaries/notary";
import Link from "next/link";
import Pagination from "../ui/Pagination";

export const notariesArr: INotary[] = [
  {
    id: 1,
    name: "Баланчаев Баланча Баланчаевич",
    rating: 4,
    region: "Джалалабадская обл",
    area: "Узгенский район",
    location: "с. Нурман",
  },
  {
    id: 2,
    name: "Айтматов Чингиз Тинчурович",
    rating: 3,
    region: "Ошская обл",
    area: "Араванский район",
    location: "с. Чон-Кара-Суу",
  },
  {
    id: 3,
    name: "Жолдошбек Асылбек Зайнидинович",
    rating: 5,
    region: "Чуйская обл",
    area: "Панфиловский район",
    location: "с. Чолпон-Ата",
  },
  {
    id: 4,
    name: "Мурзакова Бермет Айтаевна",
    rating: 2,
    region: "Таласская обл",
    area: "Бакай-Атинский район",
    location: "с. Ак-Бакай",
  },
  {
    id: 5,
    name: "Султанова Гульжайна Женишовна",
    rating: 4,
    region: "Баткенская обл",
    area: "Баткенский район",
    location: "с. Ленинполь",
  },
  {
    id: 6,
    name: "Асылбек уулу Калысбек Айдарович",
    rating: 5,
    region: "Иссык-Кульская обл",
    area: "Тонский район",
    location: "с. Чон-Сары-Ой",
  },
  {
    id: 7,
    name: "Токтогулова Чынар Умаровна",
    rating: 3,
    region: "Нарынская обл",
    area: "Ак-Талинский район",
    location: "с. Келсек",
  },
  {
    id: 8,
    name: "Жумабекова Чынаркыз Камчыбековна",
    rating: 4,
    region: "Таласская обл",
    area: "Кара-Бууринский район",
    location: "с. Боз-Суу",
  },
];

const NotariesList: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "50px", alignItems: "center" }}>
      <Grid
        sx={{
          justifyContent: "center",
          alignItems: "flex-start",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gridRowGap: {
            xs: "15px",
            md: 0,
          },
        }}
        container
      >
        {notariesArr.map((notary) => (
          <Link href={`/notaries/${encodeURIComponent(notary.id)}`} style={{ textDecoration: "none" }} key={notary.id}>
            <Grid item key={notary.id} xs={12} sm={12} md={3}>
              <NotariesCard notary={notary} />
            </Grid>
          </Link>
        ))}
      </Grid>
      <Pagination
        currentPage={2}
        totalPages={15}
        onPageChange={function (page: number): void {
          throw new Error("Function not implemented.");
        }}
      />
    </Box>
  );
};

export default NotariesList;