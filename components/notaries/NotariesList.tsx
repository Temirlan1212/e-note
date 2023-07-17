import { Grid } from "@mui/material";
import React from "react";
import NotariesCard from "./NotariesCard";
import { INotary } from "@/models/notaries/notary";
import Link from "next/link";

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

const NotariesList = () => {
  return (
    <Grid sx={{ justifyContent: "space-between" }} container spacing={2}>
      {notariesArr.map((notary) => (
        <Link href={`/notaries/${encodeURIComponent(notary.id)}`} style={{ textDecoration: "none" }} key={notary.id}>
          <Grid item key={notary.id} xs={4} sm={2} md={3}>
            <NotariesCard notary={notary} />
          </Grid>
        </Link>
      ))}
    </Grid>
  );
};

export default NotariesList;
