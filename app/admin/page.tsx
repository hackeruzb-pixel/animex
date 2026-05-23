"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  getDocs,
} from "firebase/firestore";

import { db } from "./../lib/firebase";

/* ================= TYPES ================= */

type Episode = {
  title: string;
  videoUrl: string;
  number: number;
};

type Anime = {
  id?: string;
  title: string;
  image: string;
  description: string;
  episodes: number;
  genre: string[];
  status: string;
  views: number;
  rating?: number; 
  episodeList?: Episode[];
};

type UserType = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  banned?: boolean;
};

/* ================= COMPONENT ================= */

export default function AdminPage() {
  const router = useRouter();

  const [active, setActive] = useState<
    "add" | "edit" | "episode" | "users" | null
  >(null);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] =
    useState("");

  const [episodes, setEpisodes] =
    useState<number>(0);
const [rating, setRating] = useState<number>(5);
  const [genre, setGenre] = useState<string[]>([]);
  const [status, setStatus] = useState("");

  const [editId, setEditId] =
    useState<string | null>(null);

  const [selectedAnimeId, setSelectedAnimeId] =
    useState("");

  const [episodeTitle, setEpisodeTitle] =
    useState("");

  const [episodeUrl, setEpisodeUrl] =
    useState("");

  const [episodeNumber, setEpisodeNumber] =
    useState<number>(1);

  const [editingEpisodeIndex, setEditingEpisodeIndex] =
    useState<number | null>(null);

  const [animeList, setAnimeList] = useState<
    Anime[]
  >([]);

  const [users, setUsers] = useState<
    UserType[]
  >([]);

  const [search, setSearch] = useState("");

  const animeRef = collection(db, "anime");
const DEFAULT_IMAGE =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUSEhIVFRUVFhYYFxYXFRUVFhUYFxUYFxcXFxcYHSggGBolGxcVIjEiJSkrLi4uGB8zODMtNygtLisBCgoKDg0OGxAQGi8lHyYtLS0rMC0rKy0rNS0rKy0tKy01NS0tLTYtLS0tLS0rNy0tLSstLS0rLS0tLS0rLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAAABwEBAAAAAAAAAAAAAAAAAQIDBAYHBQj/xABIEAACAQIDBQYDBAcGAwgDAAABAgMAEQQSIQUGMUFRBxMiMmFxgZGhFEJSciNigrHB0fAkM1OS4fFDY7IIFjQ2c3R10hUlNf/EABoBAQADAQEBAAAAAAAAAAAAAAABAgMEBQb/xAApEQEAAgIBBAEDAwUAAAAAAAAAAQIDEQQSITFBEwUiYTJRcRUjM4Hw/9oADAMBAAIRAxEAPwDTQKcApC04BQKApYpIFKFAoUdEKUBQGBQpmbFojKrsFLaKToGP4QToW9ONOSEj253v8fpQLpnGYpIkaSRgiICWYmwAHWqFj+2PZsUjIBLKB9+NRkJ9MxBPvWS787+YjaTspJjw4a6Qj04FyPM3Ogm9pe9bbSmutxBFYQr/AIlyc0hHU209Kv8A2S4BVwxcgu0oIL/dGozqG0Z2JAzNw8KqPLWPbtbOeeYKscjhdTkBNjyueCjTiQfat43dxXcxrG4sVAFlOYceRNr8eNh7UF0hccOlLkmAqpQbbSTEyojXaJUDa6Xa5sRzauxhzwaQ+wGt/YcTQTVTMyyXIyhgAGNmDEXuvA+Ua2vqetCcIFCyEWOgBF76cuNq4W8e9eHwi5p5liFvCujTN+VBf58PUVlG8HaziJCVwid0n438UjevRaJ1Mtjgw0MDSzsI0L2HevZSI0UBUBOuUWJtw1NVjb/aps+C4jd8U/4YhaP/ADcCPnWF7Q2hiMU2aeV5Tx8TEj4DgKXs8mJgxHh0zfl5kD041Xqhr8F+nq0te3O03amJBSBfs0eoyxLZ7W4GQ6jnqoWqfLs7FSsXcO7NxZ2LMfck3NbRsjccMqvoVIBW33ri4N/lVlwW5sajXieOnD0FWYvO8e6+KPCP603j93MRCneSJlXhe/M16lw+woU0CCsW7X8S2J2hHs/Di+TKuUc5ZOvspGvqaCP2KbpDE4g4uZbw4cjKDweXiB6hRqfda9A2rgbt7JiwUMGCVh4FzMLjNK/Fjl4kXOY9Lp1qw2oEUg041NOaBpzTTU6aQwoG7UKXahQOKKcFEopdAYFKApIpdAYFHQFCgYx2DjmjaKVQ6OLMpAIIPvWM71bK2ls6YmF5sXg20MMzPMjjmhQm7DXl8b1t1JlC/etp1oPJG2xNJNI7wCNhYskceVIxbQFR5dOtQonFgDfzXOvLTl1r1HPh4THkaFLFmuvLLc2PA5uXG3wtWX9o+yMIkKNBEDI0nhIsQfE5cNbjfMf8g6UDW5uy8L3JnKpISSA5UcuqcAR7VP2ttrKh7thmOVVNtBmsM1ugBrkbk5jEwfKFAJGtvLbMCTpzvrawNcneDeSIju4EDPze5Makf4egLj9YgX6UIjbv7J27htnxtldmZ2u8jXLu1uQ6Vz9u9quIcFMMoiB0MjWaQj0voP64VR8jO12JYnnUWfibcqiJiWlsc1jcpHevM5d2LuxuWYlmPuTUyLB1zMPLlYN05dauOFw4YBhqCAR8awzW6XqfTMNcu49w50eDA15c/T1rox4K44V0IsJflUrCQWQg/dJX5aj6EVzfJL268etJ6fUtH7IcaZMD3TebDSNF+zYNH8MrAfs1d7Vl3Y/LbFYyO/migkA9VZ0J99V+lapXfSd1iXyXJx/HltX9pINeX13hmXaeIxECCSeSWRYWIzFMzFVKrwLZbAE16exL5UY9FJ+lZB2K7nhUXHTC7yk90DY5UHF/djw9qsxX3crdxsJGZJ5GmxUwBnlYkk8xGt+CLc6DSrGaM0hjQIc0g0u1ERQNkUhhTpFIIoEWoqVR0ChSxRClLQKFKFJFLFAdChR0DOKw3eLYMUNwVZeKkcDY6EelUjdDfNsZiZ9n4lVWeHP447hJAhCkhTqp1Btc+9X4Vnuw93JcFtjFYgYZpocUt0mRo7wFmDOjxswNrjiL6BeNzYLBjsDlBN7AAkk9OJNYRvzinmnDSEIgBEQsdFzcWt95yr6dAPjv2+G2cPhMM8uIN10ARSM8rX0RQeN+B9L15w3oklnb7VIuTvHsI18kahbIo9bKdfQ0IjbkHHO4K3spNyBpc+p4nT91P4XC31pnDQeIGu1FlSMu3BfqeXz0+dY5LeoenxMMRubenO2g4jWw8x+gprYWzxM5zHRRcjr6VAxExdix4n6elSNm49oWzLrfiDwNW6Ziuo8sYz47Z4tePtdbbex0jTOmliLi9+NK3a2mBaJzbXwnl7VA2ntpphlyhV5gG9zXKFVrSZpq7XJy6Y+R8nHjUNZwgp11/vPcfPL/ALVnmzN554RbR16PfT2IN6mS72zvdURVLtfS7HgBYXPpWM8eYel/VsVpidTtpfZSL7TlI4DBtf3M8dvoDWv1kHYRgXR8ZNIbkiFLk/es7svwBT51p+O2miDjXVSNViHh8rJ8mW15jW5RN8cRlwcwU+ORRCn552ESfVxU/Z+EWICNNEiRY19lH+3zqmQ7WXGbThwxbwwI+KdfxMuVIlPWxkL26qpq6xygLcnzEkdTc6fS1Wc55jSLUkTAnKNTz6L7nr6cacoE2oiKXSTQINIYU4aSaBu1ClWoUChShRUoUCgK5e1tuJhXTvgVhkIXvuKxueCyfhDcA3C+nMX6tR9pYCPERPBKM0cilWHoR9DQSRShVF7KcdN3eIwU7F3wUzRBzxZATl+nD0NXsUBU1jcYkMbyysFRFLMx4AAa09WadoTvtDEps6IkQQ5ZMUw0DOdY4dONh4iPUcwKCrYiSfbGK+0MCIUNoI/wqTYOR+I8at28G5gk2dNCiDvFtJGba3iAsvx8Y/aqy7C2RHEoVALAAfKu47BFLHQKCSfQC9B5fwOFDC/X4EW61B3mlsyxjkAWtzP3dPQfvq07/SwwY1u4PhmVZWSxIheSxt63BzZbcTVQxcHeYrJwzFRxvyANzzOhv63rGK6tuXq5eRGTBFaR37RJzY27ks47zyp+I8/YV2BuvEOOY+t7VYsL+j0jOUDS1rofhfQ+x+dQsVvTEpKCHvHHNWHd3/ORf5A+9ZTe9p+12Y+PxuNX+/G5cV901PlZh72NGu4kp171R7qf51Kk3gxJ8iQxj2Zz8zb91I/7y4rg2R155R3Zt+blWlYyw5MmTg2ntWYJg3JXNZpSQPMVWw4aKL8/3VNTZ8EAORbW4sdT8zwqTFt2N0sgKkDVDYZfjwI9Remb35Zj8kH/ANqwve+9S9Li8fjxHVjiJn0sO6+8sWEwtiTmdmkcgG12ta/WyhR8K5O9G/8AYFYjnYj3Vb8z19qhYTZH26cxPI6qiZyUsB5gLEnhx09jVt2f2e4BbZoSx6M7kt6kXso+FddJ3V8/yqRTJMb/AJY5BtedJvtCSust75wxDX/l6cK03dTtfYFY8ctxoO+jFmAtYAryGmpWrzhN1sBGV/ssFybf3amwAJtqPTia7+Dw2GXyQRD2jUfuFXc5zZe8uAlQGLFQFeQ7xVN/Ym967A6ioiKvJVHsop9WoHKSRSjRUCDSDThpBoE0KFCgUKWKSKWKA6UKKjoKnLsyXC498VEjPBi1VZ1XzxSL4VlA5qRYG3C1+tQN8N6cXsllkkj+04SQ2DiyyxNa4VuTXsbHT+d7Fcfe/CRTYOaKYApIuXW3G91I6MCLjncDQ8CDOA3rgxOGOIwjd4fKFOhVzwEg+6Bx+FNbB2L3a6nMzEs7njI7G7MawnA46XZ+IWTDJlAIEl5S0MwFlIOYArrc3OoJPAaV6E2LtOPE4dMREw7t1uDcG1vMD6ggg+1A1tWcYRo5/wDhM6xzfq5jlSX0sbAnofSme0LE5Nm4xlNiIHFweBIy/PWudt/buCmhnw7zJZleM3I8xGmVTq2tjcdKy7effKXEbIWGUSZ86xSPkKxuY3LLckefKqkgHjfToFGjkkncyO2Z3Op0JOluHDgLVaZt15Iu7xKuthYdyxtKq6lQB+Ug2NjreqrsWVs65QCVN1BJWxvcHw+I2PK9WbEExvJJNIXYopsFCoBawCgchbKB6E86redQ341erJHfXtG2rtIk90LryfXU/q6cqhnQWGnp0qHglLEueJvr06mpmJxAjUEre7EAdbDxH1sdPelKRWNHIz3zX6rS5kuKdW+lS8CzPxB9+X+tR8Vhs2Vk5nmdNefpUtJAjKNSSQADx1Nr25CrMDmIi9Bca+3r7V1o8YGjCghbkCxPkJ4gnnaxI9CKgYjVrDjoR87H4aipGyMAJsUkHAOA/wAhb/T4VS1It5dHHz2xTOp9LrsPaMMa5MNGS2mZ7XLN1J5+lWHCNKxt5eZH3vc1Gmhh2fhmmZbKluA8TsdFVfUn+fKu9ufu/KFGIxRvNJ48g0WFSPCgHMgW1Pr63uwtMz3k9gMJ48jE5imcX5gNY29rrf8AOK78WHAqo7d2mYNobPY2yXxMEzmy2zNGovraxZIzw5ir5ltRBpI6XlpdEaBJoqVRUCSKQRSzSTQIoUKFApaWKQDSgaBdCio6AxTeKQsjKBe6kWzZb3FvNy96WDR3oPO/aRsB4ptIpFuT55FeO1uKHQLfTiBwrvdjO8iQB8FiJe7DEPC5NkDMDnjJOgOgIH5q13aODhmXJLGrjowv/tWSdoHZkEw8mIwru2QZmhKqbqpN2UrbUBm4gkig0bEbawSMVOIg7w2JW8ZNxpqawrfveCXaeL7mBf0auciLZRI+oaU8iSNL9BVNhtfXppz1PX041f8Asj2cG2ijZO8RUckjQR5lbKWAvY3VtD1FBK3X3MaId5KpzBbnW4ta55C3CuftXBB8PNiZDYM3dwj8T31t6KAR+yxrat6dnxJhsRNlsywyANc+EMuUgDgBwOnSsA2xtkyJCgFooYwkS82dtZpm1OruWPotgOd6z5aVt01n95R8MoHsoufl/v8ASpsG62Kxaq8SqVXwAFspLWzyEaWtmbj6VFK5IWLHU6E+p4/Q1ft2MTmw0EGExCI5TNKzKrKGkOd14g3BYjjyqzNSot0ceD3ccDOeVmjYX+dN4/dzEYSRZJ0yknQF1Zicp/DV523iMREpBmw97eHLBJmBtplImIBJ5+vQWFP2sJGaRpnUlQqKATZXlIvcszFiosSSSbnU0EKWS9zzDlR+XIuvzFWzcVY//wAnF3hsqicXPodB9TVT2i697ZGBVbajgbBQf41Hx2JcMpQkOpJuON+dCI217bmzp9p7UhihsMHgHjeVj5HkuHK2HmfLZfQG/PXUrXPveqF2SY9ZMPZZMzBiXF1uGbUki1wb9RV5DAWUvmIFr6ZiRxNhYA8+FvSgyvtUxMcTKys1p3LDwkqskUdpLm4uGXudPS41FXjs/wB4xj8FHNcd4BklHMOuh+fGqb2z4NzAGUAoxHe6+GNhYJiF5obM0baWZbXsQDVD7Kd5W2firOb4aW4kN9FymwltysSL+h9KD0jagaNGBAINwdQeoNGRQN0VLtREUCCKSwpy1JYUDVqFLy0KBApQp0W6UrToKBuhTwA6Udh0oGaRImYEG9jpppUmw6UNOlBnu8G9T7LxEa4m8uEm8stryQsOKt+Mc+vGrjhcTHMiyRsHRxdWU3Vl9/4Vyu0PdZdo4RoRYSKc8TWGjjlfkDw+NZb2a/asI74dsQ2EkV/FFioWkwsmuhRgR3bjTgRm01NrAO72k9nGHdGnwcTRzgF2CD9G4FySRfwtx1HOqr2Q7QMEzOpumX+0IDwS6hZMtrnKTrx+9yrd8KsuUiSSNm1PgjKpbkCCxJ+Yv6Vle2JMNsd3fjMYYxFChAu6tiVMknEhRHIgF9Dc6EgEAz2o76qyvho28H/EK6hxxWNSOvE+nvWTK2Z87a8+HU2AA6Ci2lO0jZnNySSfUnUm3TlbkBQwTeID1X+P8zUJmJdWeDvZIcODxZA1uPjNyfgLmr4dw8Oqq+HxRF1uVlhaKTUXsSUC5vhVT3c2xGcVhleMAriJGMl/OGUhFIty01rbRs/7QbDyjRm6fqr+t+6pQo+B7MIJ4TL3sgdb630LAcNRp6ketVzDdn8cmI7vvWVFTPJJ3byAXJUAZVPEhiSeh9hvRwiRwFFAVVQ+gAAuTVXngGEw08xBHeoz25oStkS3LS37RbrQYFtKBI55I4mzRiXIrcLqNCfr9KiLNmcn3+tInck6ixF7/mbzfxplG1+NVt4a4e1tu5snFSRSLLC7RyDg66H1B6j0rbdx97kxbZZsseJKZcw8koXUMtzbMDfw1heBrsJLlAykh8w7vKbOX+7kI1BvasYvMW09S/Fpkx9XiW576YBMTA0MhZGCMVkCoQRwb7wuOZHQV5w2imWYoWRh4F7xR4WTQAr78Tf/AFr0ZhVMeGUOjO6WbwafpIkUMAza3OV9WJuCRe1YBvNtqLFYiRkgEQJOYd6zhiG8wtZQeNhYjWuh4zV+xXe4Sq+z5pVZ4j/Z2uf0seoKi+pK2Fudj6Vq2WvGzSDKCtlZTfMC2YnQg8eVuIt8a3jsj3pxE8ATETJMF0DtIO+S3BZQ2rDowv60Go5aIimUIIuDcdRqPmKFA7aklaZNJNBIy0KjUKB0GjBpIpVAq9GDSKMUC70d6RSJplQFnYKo4kmwHxoHqYxUStYMoYcwRf2Pwqt4rtB2ehssxlINj3MbzWPqUBtXF2t2r4RUZYVlM9vAjxOg10zMWHAan1tRMRt0O0Tez7GgjiKmdrEKQTlUG+diOAuNBzrBduu7l5XYu7td3Y3LEn+tOVd2bE98zSNJ3kjm7sfMT7ch0HIVDxEAIIPOuS2WZt+HvYfp9YwTO92lXJ05DpTdipB9v6+tT50CHU3NracahZ9dQK3rPZ5mela+fJOcrax8WhX0I1FvjXo/su3jTGYUA2EsejrzB/1439a8+7M2e+Jcqgsqi7v+EcB8zpVl2A8uBf7RATmViDfTvFGUMrW6MGt0rRxt52pKr/fxAUWzLHhp5A1jfisTXHLSq12tbYWHBk3ALagG4YnkCpsRra9+lUHfveBNpBHiZ45e7KmPMy+JPF5QbG4vr6VmUYGmgotNdREkKxPqfrTndEakW9zU+SWw6nkOXxqBIGJ8VRpETMeDi45hwt8q0zsY3eM8zY+fyQnLHfg0h5j2/eazTZ+AeaVIUF3kZUUerG1z6Dj8K3XamOOAOC2LgyiyOFzTFQ3d6m8gVrgu1mtfhanTC1slrRqZXfa6gxFWkEQa4ZtMxzBhlUfiOtuJ41533T2dhcRtGNZGtFJJJZLE3UqxQFmtY2sbm97Vt+/SmDZ0kMbPI81oVLuzO7SXLtob6IJGsLABdNKyf/uDJFE00co75BK0a2GY/Z3AYr+sCCQfSpUaZi9wMDItnw6kuZAJFsHjDBnBOutiNLX49L1R9pdjk1lWBkIDasxysyngwaxIPVSLcweVaZuntf7ZhYZwT4kAYX4ODZwb63DAirCrAUGa7sdmE0CjvNoToRfwwuQgF9B478vStB2Zs5YFyqztc3LOxdifUmpatelWoEGkmnDSTQIoUdCgUKVSVo6A6Oio6BMsgVSzcACToToPQcari7AOMczY8Z0veHCk/oo1+60oGkkp4m+g0A4XNlIqpdo++a7NgGQB8RLcRIToLDWRv1R05nT1oOxtTamCwMead4oU4KLDM3oiKMzH2BrBN/8AbmGxeIeWAzOzED9KqIEQXyqip4rAn72uprgtNitoYgljJiJ5OguxHQclQfAVoWwux3EEA4iZIQeKIDI3pc6D3omJ0zZYHPmcA8jzHxvUo4gAAPM7notl+vE/5a0rbXZKsaFlxLtYE3McQUdAdb61k+KvHIYiRobEi45261ExC1L3jtEl4iZbaIEHqSWPz1P0FRFQnU6DlXZj2ZHlzC7e/wDG1RMTHWU5Y8Q9CnBtWOu8rH2eQM6YxI9XKwkAWzFVdixUHzEEpcdD7A2OfC5FiLKAHtmy+XNJ4iR+2ePrVf3OD4eEbTiRm+zYgpOoPmhkReA63I+IWtc2jsuCfDmVPHh5VL5k1ZL65gvMX4jiDfqa1h5+T9Usy21sCSE3AtwZG6EajXppVF2nGBIWUWV/Go6X4r8GzD4Vps23JZ54kMn9lDrGRkUWDM8SyObEklwnAi16pW+ezjBMyEEC5dbi1wfPb42Pxp7TXvXpcMEAXOvQfzo1i0zH/akQJc3p7EtfwjlxPU86lmf3dx3c4pHtqLgG9spYWvf2v862PYOx5MbtEbRkDLDFGgXMpRpHVW8SrxEYubX4nUaa1g0nm0/q1aJuh2oTYNe7mjE0dxqGyyKBpYA3U/Sg3WbDxu0c5FygJTMPKWFiwHJrXF+jN1ri4hY7G+UKgfxMQAqtfMSx4A3NVvE9pcOKUJhWCyPoEkvmB/KONvSpOzNzkZ1mxcsuJdTcLIbRBuREQ8NxQd/dbAxxRt3Lh4ZHMqWtYZ/NlI0KE2I9zXb41Gw+IVwGUgqRoRwIqXHQOxLal0FoGgSaI0ZojQJoUKFAa0dEKVQCjohSqAAViW9uzmxeL2rjZBmjwEXdRKdQZMtgbHkt2c+pWtuArkYHYaBsaroGjxUuYg6hlbDxRuCPzK/zoKz2NbvwwYCOdQDJiBnZ+JAuQEB5AW+tXfEYgRqzuVWJEdndjbIFseBGq2za30sON65G6m6owCmOLEStDclYnykJfiA1sxFVXtbxskxg2VhzZ8UxeYg+SFDxb0JDE+iW50FP2xvRNtWaSUO+H2bhfE5HGQjyrb77sbWXkNTas02i2eRnAsCbgcSB6nmavHaNjIYEh2ZhNIYPHIbm8sp0zN9TblcVR01FBO2PjvuHzcv1/wBX0bofhTmLPT+vQ9DXIlj5iunFN3y/8xR4h+MD735hz61lenfb0ONyZ6fjt/povY3LG8WKw7oHBIZg3lKOmVrjqMpI4867saYvZrXwX9ohZrNEddTzCjUjo63NjZgxBY5v2fbUMGMC/dlUqemYeJD62sfgTWg4vbdiwALMFJYLfReJW/BVHInlWlfDjyxq8uTgpnxWJlWPDnDSTxYpY4mBFply4iIjMo4up5W1PGoe+GOxG1gmITZ8iBVDk+NsyEasGKKpFr8zUvGY+WGfDY6aMxBZMO4uQQVZmje5U+E924OtXP8A8JiZsNYCNnbEQccpExvJ7FZC/DSzrUqROmETYYxsVB48D+qRe/vbT3pDxhR+6u5vPhhHi3jFyAbqTxyt4hw9/pXEx0mtuQqITfygyIAb0hbt7UNWNP5LCpVJQldQSCOBBII+IrXeyve1plbCykd5GLobAZl4G/MsOZPWsdkk5Cunurjzh8XBKDa0ig628LHK1/gb/Cg3fdrF5GxOHP8AwsQ2XX7kqiddOQGZh+zVowxZvaqZsxP/ANvNGRbvcLFJflaJ2Vvoyj/atDwy+EG1ri/z4UC1FhRmjNJoCNEaM0VAmhR2o6AgKVRCjoDFKtRClCgAFLvSajY3FrGuZjYUDs0oAueFYptjbAbF4zFg+J2+zxc8sMQAYjoGbX4VZdv7zyzh1gU2UsL+wv8AxrPdv7O+z4azN42GRRwuzeJz8FJPxoKVPKZGeQm5Yk3P0+lqbh/iafkUAWFMRcT/AF6fwoBmtp60kkowdTYg3Bo5xrf50mPUZTQTZ5PLiIhazAkfgcG/+U1eMHiJMXBLBFK0azyYYsAQt45P0bK1wb2GXQW+PPPcJNkYq3kYWb+B9watm5ERdMVADZxEpjN7G8cufQj0N6iI00vPV3XB9p7IEows2DkWEeBcVncM5Q5GZ2Vg2W44mrTv9gY4NnwzQs5GHZMrZi7GKSyMMxuWWxB1v5RVX3b2HiDJEJCGVM5U8SDIym2vQg/Orl2pvl2TPa2hjX2/SL+6pZsW3ixIebvNASijT2a37hVZxLX068a6UsmYEnlk+PnqFhI8zFjUQtPiD2FgsLmomLm1tU3HzZVsONc2GO+pqVQjXSiPP2NPSramYqDeocWGx+yZgRkxODljY828CTN8y4HvetLw5JUE8Tr89QPlWNs6jB7BxJNlimSI2P41Jkv/AJFHzrZoybAniRegU1FQoUCTRUZojQChQoUAFGKIUpaBQpVEtJZqAM1QsTgFkN319OQqYK5m9G0/suEnxH+HE7D1a3hHxa1BXt04lfDSyso8WKxAQcLqshRPoo+tZN2g44SYx41N1gHdg9WJzSt8WsP2KvmxtonA7Khkm8KJFcdXdySLX5m4FY3iMQWZmbixLG/G5NzQJeowFjQLk8OHX+uNJXDlqA5WHUUyi2P+9TosHXR2bgMzABc3Dw82JNlX4n6A0WrXqnTlrgpJCqrGzO3lUKSW9gKtm7u5W2I5I54sK6MrDSQrHmBNiCGIOUi/KtY3N3U+xQtO4DYpkLa/dFtLDoPTpXV21truFhxQImwsuRJWUA2D6LKCOK5jYj9a/KiJ/CFgdpRQq/2pWw8sagmIlWZwSFHcsDZwzFQCNfEAbGqlvBv39rw0sBwQ+zuCmZJWLKRcgq3d90XFvKGI08x413t4Y4YQqYte/wBnzMBHPcl8I7nw+PzBCTo3KqVvAs6YgbGinDQwhQG0BRXF8pAFiwB1b1FEM5lYi4sQTl4i3I2Nv2qmRKI19hT21Iw2JcjyIcq+yaD9xrlbSxOY5RwH1qEyjSyF3J5fwqXDFTODhvU5xYVKELG8R/XCmYqVi31HsaaiNBrDsJN3cG/D7PiEP7RxEifPLfj+L0rcle4B6gH5i9YdsSAT7tTqvGBpHP5lmWX55Fb4NW1bOJ7mK/8Ahx/9AoHzQNA0RoCNEaOiNAKFChQGBS1pAoFqA2aiAoUdARas77ZMbnhw2AUjPi50zA8O6jILEnl4ih/ZNaKFrHe32SMSYXKxE2WTQcBG2hY87k2A9AaCn9oW9AxsyxRDLhcN4Ih+PKMveH3A09PfSqsM2vIfX/SlrHpTVyKB6KG/H4DpUyOGo0GJ61NjkBoFhK7W4G2UgxDTNA82TyhVJCk6ZjbmFtb87VA2Zs9p2sGyICA8h+7fgq/ic8hy4n1uYlgwlkUMkSaJGhKySHnJKw11P3egF+lExOne2d2oIcYI5YGjWSyiRlsQdbAk8r8B1qbsaJI8Ti9lS64aZWmgvayxzXLID0Vw9hyAXrWbb87WWaJMhCuWHhHEZdc/XpxrgbwbfxWJaN5pDdEyKFugCG1xobm/O/So3G9LRjtNZt6XrFb54eHZ+K2bK5xMp72FCi2jUahJGc6aGxst9Ry5U3Ze22RyznPIe8Km1i0j2uXOpPAWtoAK4jRgxSkDVCh+DXBH0FL2MMqvM3BBlX8zaD5ComVqY9zBW0cRlBAN2Ol+fqa52FgLHnRqjSv8vgKuuzN3YlgGImlIQmwSEB3v/wAxz4Yr8gdTU+I3KNTkvqqNsjZkSxiadS6sSsUIYoJCps7yuviWNTcALYswIuACTKxW1IcuWXAYPJ/yoTBKB1SUPe49b3510sYI8RFGMKhVsOvdmJnUvImYsJFOgY3Zrga8DVX21M6RGKTRswKKSCyfiOnAHpWHXNrdvD0oxY8WH7o+5XtqRKshCEsh1UnjlPC461FWlzPc03XQ8qfLef8As/TI+DxMJsSJwxU2PhkjVRcdDkb5Vq9raCsQ/wCzxLaXFr+JIT/laT+dbVNOqlQxsWNlHMnjp8KIOGiNHRGgKiNHRGgKjpNCgBajWkKKWKBQpVJFKoBesK7e8I4xkMxH6OSHKp5ZkYlh72YH41u1V/efd6DGQHDYgHIxvHIPNFJyseXEgcje3S4eYI5KXIK6e+e6GK2bJllGaM+SVQcjeh/C3oa4cMtAom1drd7ZMk5JvljXzObAeoBOl/XgK4knHhfrUnE7WkZRHfKg4Iug9PegvW0drYXCRqsJDSi4SwzCIHiyg/fbXxtqbnhVKxO1JZWOpXXU3ux+P8qj7OF5YweBYX/fUrCxXJPqf31S9ul1cfB8klYTDczqTTm01yoG6vlHsi3J/wAzAV0oIgoLHkL/ACrj7wyHOsX+GoB9XfxN9T9KwxzNrPT5mOuHBqPbnQBmOVbkuQLDnroK6mMi0XDodI/O3EM58xv0HAVMw+z3w0QlysGbw95lJWO/3A3AOfWuY0thZdB/XE866I7zuHlXj469PuTwkSMZV48z1PWlbL2w8EveDxKfDIn3ZIz5lI9uHQ2qAaTYnhUueJ1O4WDbdkcqhzIbMh45kYXU351XsYDfW1+l9fjXQwmNWyxycU/u26Xv4D6XNx0rkzoQSDx5/wA/jVK1068nInJHcwaKjNEK0cstb7AFCyYydyFSOKPMTwFy7XJ9Apq8bkYmTaOKl2lJcQJmiwiEEeH78hH4msPaqLs7Z8kWzsHs2LTEbVkMsp/Bhxa1+l1A+T1tmytnx4eFIIhZI1CqPQc/c0QlURo6I0BGkmlGkmgKhQoUBCl0KFAYpVChQHTGP/u3/K3/AEmhQoKR2yf/AM+T8orzfHxoUKCdyPvURuNFQoJWC86+9dPZ9ChWGbw9X6b5/wC/DtN5Pl+8VXm/8c3/AKzf9RoUKzweJdn1TzX+V02D5Mf/AO0xH7jVCo6FdGP9Lyub/lkmnsPzoUKs4nPl4n3qVif7uP2/jQoVC0IDUB/A0KFSS9CYD/zDhv8A4tf3vWlihQqUCNEaFCgI0k0dCgTQoUKD/9k=";
  /* ================= FETCH ================= */

  useEffect(() => {
    const unsub = onSnapshot(animeRef, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Anime),
      }));

      setAnimeList(data);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(
        collection(db, "users")
      );

      const arr = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as UserType[];

      setUsers(arr);
    };

    fetchUsers();
  }, []);

  /* ================= SAVE ================= */

  const saveAnime = async () => {
  if (!title) return;

  const finalImage = image || DEFAULT_IMAGE;

  if (editId) {
    await updateDoc(doc(db, "anime", editId), {
      title,
      image: finalImage,
      description,
      episodes,
      genre,
      status,
      rating, // ⭐
    });
  } else {
    await addDoc(animeRef, {
      title,
      image: finalImage,
      description,
      episodes,
      genre,
      status,
      views: 0,
      rating: 5, // ⭐ default rating
      episodeList: [],
      createdAt: Date.now(),
    });
  }

  resetForm();
};

  const deleteAnime = async (id: string) => {
    await deleteDoc(doc(db, "anime", id));
  };

  const openEdit = (a: Anime) => {
    setTitle(a.title);
    setImage(a.image);
    setDescription(a.description);
    setEpisodes(a.episodes);
    setGenre(a.genre);
    setStatus(a.status);

    setEditId(a.id || null);

    setActive("add");
  };

  const saveEpisode = async () => {
    const anime = animeList.find(
      (a) => a.id === selectedAnimeId
    );

    if (!anime) return;

    const list = anime.episodeList || [];

    const newEp: Episode = {
      title: episodeTitle,
      videoUrl: episodeUrl,
      number: episodeNumber,
    };

    let updated;

    if (editingEpisodeIndex !== null) {
      list[editingEpisodeIndex] = newEp;
      updated = [...list];
    } else {
      updated = [...list, newEp];
    }

    await updateDoc(
      doc(db, "anime", selectedAnimeId),
      {
        episodeList: updated,
      }
    );

    resetEpisode();
  };

  const deleteEpisode = async (
    animeId: string,
    index: number
  ) => {
    const anime = animeList.find(
      (a) => a.id === animeId
    );

    if (!anime) return;

    const updated = [...(anime.episodeList || [])];

    updated.splice(index, 1);

    await updateDoc(doc(db, "anime", animeId), {
      episodeList: updated,
    });
  };

  /* ================= RESET ================= */

  const resetForm = () => {
    setTitle("");
    setImage("");
    setDescription("");
    setEpisodes(0);
   setGenre([]);
    setStatus("");
    setRating(5);
    setEditId(null);
    setActive(null);
  };

  const resetEpisode = () => {
    setEpisodeTitle("");
    setEpisodeUrl("");
    setEpisodeNumber(1);
    setEditingEpisodeIndex(null);
    setActive(null);
  };

  const filtered = animeList.filter((a) =>
    a.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* ================= UI ================= */

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#020617] to-[#0f172a] text-white p-4 md:p-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">

        <div>
          <h1 className="text-3xl md:text-5xl font-black">
            👑 Anime Admin Panel
          </h1>

          <p className="text-gray-400 mt-2">
            Manage anime, episodes and users
          </p>
        </div>

        {/* HOME BUTTON */}
        <button
          onClick={() => router.push("/")}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 transition-all px-6 py-4 rounded-2xl font-black shadow-2xl"
        >
          🏠 Home
        </button>

      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        placeholder="Search anime..."
        className="w-full md:w-1/2 p-4 mb-10 bg-[#111827] border border-white/10 rounded-2xl outline-none"
      />

      {/* BUTTONS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">

        <button
          onClick={() => setActive("add")}
          className="card"
        >
          ➕ Add Anime
        </button>

        <button
          onClick={() => setActive("episode")}
          className="card"
        >
          🎞 Episodes
        </button>

        <button
          onClick={() => setActive("edit")}
          className="card"
        >
          📺 Anime List
        </button>

        <button
          onClick={() => setActive("users")}
          className="card"
        >
          👥 Users
        </button>

      </div>
{/* ================= ADD / EDIT ANIME ================= */}

{active === "add" && (
  <Modal onClose={() => setActive(null)}>

    <h2 className="text-3xl md:text-4xl font-black mb-8">
      {editId ? "✏ Edit Anime" : "➕ Add Anime"}
    </h2>

    <div className="grid md:grid-cols-2 gap-5">

      {/* TITLE */}
      <div>
        <p className="mb-2 text-gray-400 font-semibold">
          Anime Title
        </p>

        <input
          className="input"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          placeholder="Naruto..."
        />
      </div>

      {/* GENRE */}
      <div>
        <p className="mb-2 text-gray-400 font-semibold">
          Genre
        </p>

    <select
  multiple
  className="input h-40"
  value={genre}
  onChange={(e) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setGenre(selected);
  }}
>
  <option value="Action">Action</option>
  <option value="Fantasy">Fantasy</option>
  <option value="Romance">Romance</option>
  <option value="Drama">Drama</option>
  <option value="Comedy">Comedy</option>
  <option value="Horror">Horror</option>
</select>
      </div>
{/* RATING */}
<div className="mt-5">
  <p className="mb-2 text-gray-400 font-semibold">
    Rating ⭐
  </p>

  <input
    type="number"
    min={0}
    max={10}
    step={0.1}
    className="input"
    value={rating}
    onChange={(e) =>
      setRating(Number(e.target.value))
    }
    placeholder="5.0"
  />
</div>
      {/* STATUS */}
      <div>
        <p className="mb-2 text-gray-400 font-semibold">
          Status
        </p>

        <select
          className="input"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option value="">
            Select status
          </option>

          <option value="Ongoing">
            Ongoing
          </option>

          <option value="Completed">
            Completed
          </option>
        </select>
      </div>

      {/* EPISODES */}
      <div>
        <p className="mb-2 text-gray-400 font-semibold">
          Episodes
        </p>

        <input
          type="number"
          className="input"
          value={episodes}
          onChange={(e) =>
            setEpisodes(
              Number(e.target.value)
            )
          }
          placeholder="12"
        />
      </div>

    </div>

    

    {/* DESCRIPTION */}
    <div className="mt-5">

      <p className="mb-2 text-gray-400 font-semibold">
        Description
      </p>

      <textarea
        className="input min-h-[140px]"
        value={description}
        onChange={(e) =>
          setDescription(
            e.target.value
          )
        }
        placeholder="Anime description..."
      />

    </div>

    <button
      onClick={saveAnime}
      className="btn mt-5"
    >
      {editId
        ? "💾 Update Anime"
        : "🚀 Save Anime"}
    </button>

  </Modal>
)}

{/* ================= EPISODES PANEL ================= */}

{active === "episode" && (
  <Modal onClose={() => setActive(null)}>

    <h2 className="text-3xl md:text-4xl font-black mb-8">
      🎞 Episodes Panel
    </h2>

    {/* SELECT */}
    <div className="mb-5">

      <p className="mb-2 text-gray-400 font-semibold">
        Select Anime
      </p>

      <select
        className="input"
        value={selectedAnimeId}
        onChange={(e) =>
          setSelectedAnimeId(
            e.target.value
          )
        }
      >
        <option value="">
          Select anime
        </option>

        {animeList.map((a) => (
          <option
            key={a.id}
            value={a.id}
          >
            {a.title}
          </option>
        ))}
      </select>

    </div>

    {/* TITLE */}
    <div className="mb-5">

      <p className="mb-2 text-gray-400 font-semibold">
        Episode Title
      </p>

      <input
        className="input"
        value={episodeTitle}
        onChange={(e) =>
          setEpisodeTitle(
            e.target.value
          )
        }
        placeholder="Episode 1"
      />

    </div>

    {/* NUMBER */}
    <div className="mb-5">

      <p className="mb-2 text-gray-400 font-semibold">
        Episode Number
      </p>

      <input
        type="number"
        className="input"
        value={episodeNumber}
        onChange={(e) =>
          setEpisodeNumber(
            Number(e.target.value)
          )
        }
      />

    </div>

    {/* VIDEO */}
    <div className="mb-5">

      <p className="mb-2 text-gray-400 font-semibold">
        Upload Video
      </p>

      <input
        type="file"
        accept="video/*"
        className="input"
        onChange={async (e) => {
          const file =
            e.target.files?.[0];

          if (!file) return;

          const formData =
            new FormData();

          formData.append(
            "file",
            file
          );

          formData.append(
            "fileName",
            file.name
          );

          const res = await fetch(
            "https://upload.imagekit.io/api/v1/files/upload",
            {
              method: "POST",

              headers: {
                Authorization:
                  "Basic " +
                  btoa(
                    process.env
                      .NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY +
                      ":"
                  ),
              },

              body: formData,
            }
          );

          const data =
            await res.json();

          setEpisodeUrl(data.url);
        }}
      />

      {episodeUrl && (
        <video
          src={episodeUrl}
          controls
          className="w-full rounded-3xl mt-4 border border-white/10"
        />
      )}

    </div>

    <button
      onClick={saveEpisode}
      className="btn-green"
    >
      {editingEpisodeIndex !== null
        ? "💾 Update Episode"
        : "🚀 Save Episode"}
    </button>

  </Modal>
)}

{/* ================= ANIME LIST ================= */}

{active === "edit" && (
  <Modal onClose={() => setActive(null)}>

    <div className="flex items-center justify-between mb-8">

      <div>
        <h2 className="text-3xl md:text-4xl font-black">
          📺 Anime List
        </h2>

        <p className="text-gray-400 mt-2">
          All uploaded anime
        </p>
      </div>

      <div className="bg-blue-600 px-5 py-3 rounded-2xl font-bold">
        {filtered.length} Anime
      </div>

    </div>

    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">

      {filtered.map((a) => (
        <div
          key={a.id}
          className="bg-gradient-to-br from-[#111827] to-[#1f2937] border border-white/10 rounded-[30px] overflow-hidden"
        >

          {/* TOP */}
          <div className="flex flex-col md:flex-row gap-5 p-5">

            <img
              src={a.image}
              className="w-full md:w-[220px] h-[300px] object-cover rounded-3xl"
            />

            <div className="flex-1">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                  <h3 className="text-3xl font-black">
                    {a.title}
                  </h3>

                  <p className="text-gray-400 mt-2">
                    {a.genre}
                  </p>
                </div>

                <div className="flex gap-3">

                  <button
                    onClick={() =>
                      openEdit(a)
                    }
                    className="bg-yellow-500 text-black px-5 py-3 rounded-2xl font-bold"
                  >
                    ✏ Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteAnime(a.id!)
                    }
                    className="bg-red-600 px-5 py-3 rounded-2xl font-bold"
                  >
                    🗑 Delete
                  </button>

                </div>
              </div>

              <p className="text-gray-300 mt-5 leading-7">
                {a.description}
              </p>

              <div className="flex flex-wrap gap-3 mt-5">

                <div className="px-4 py-2 rounded-full bg-white/10">
                  🎬 {a.episodes} Episodes
                </div>

                <div className="px-4 py-2 rounded-full bg-white/10">
                  👁 {a.views} Views
                </div>

                <div className="px-4 py-2 rounded-full bg-green-500/20 text-green-400">
                  {a.status}
                </div>

              </div>
            </div>
          </div>

          {/* EPISODES */}
          {a.episodeList &&
            a.episodeList.length >
              0 && (
              <div className="border-t border-white/10 p-5">

                <h4 className="text-2xl font-black mb-5">
                  🎞 Episodes
                </h4>

                <div className="space-y-4">

                  {a.episodeList.map(
                    (ep, i) => (
                      <div
                        key={i}
                        className="bg-black/30 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                      >

                        <div>
                          <h5 className="font-black text-lg">
                            Episode {ep.number}
                          </h5>

                          <p className="text-gray-400">
                            {ep.title}
                          </p>
                        </div>

                        <div className="flex gap-3">

                          <button
                            onClick={() => {
                              setSelectedAnimeId(
                                a.id!
                              );

                              setEpisodeTitle(
                                ep.title
                              );

                              setEpisodeUrl(
                                ep.videoUrl
                              );

                              setEpisodeNumber(
                                ep.number
                              );

                              setEditingEpisodeIndex(
                                i
                              );

                              setActive(
                                "episode"
                              );
                            }}
                            className="bg-blue-600 px-5 py-2 rounded-xl font-bold"
                          >
                            ✏ Edit
                          </button>

                          <button
                            onClick={() =>
                              deleteEpisode(
                                a.id!,
                                i
                              )
                            }
                            className="bg-red-600 px-5 py-2 rounded-xl font-bold"
                          >
                            🗑 Delete
                          </button>

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

        </div>
      ))}

    </div>

  </Modal>
)}
      {/* USERS PANEL */}

      {active === "users" && (
        <Modal onClose={() => setActive(null)}>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

            <div>
              <h2 className="text-3xl md:text-4xl font-black">
                👥 User Management
              </h2>

              <p className="text-gray-400 mt-2">
                All users, VIP and owners
              </p>
            </div>

            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 rounded-2xl font-bold shadow-xl w-fit">
              {users.length} Users
            </div>

          </div>

          <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">

            {[...users]
              .sort((a, b) => {
                if (a.role === "owner")
                  return -1;

                if (b.role === "owner")
                  return 1;

                return 0;
              })

              .map((u) => (
                <div
                  key={u.id}
                  className={`relative overflow-hidden rounded-[28px] p-5 border shadow-2xl

                  ${
                    u.role === "owner"
                      ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border-yellow-400"
                      : u.role === "vip"
                      ? "bg-gradient-to-br from-pink-500/20 to-purple-500/10 border-pink-500"
                      : "bg-gradient-to-br from-[#111827] to-[#1f2937] border-white/10"
                  }`}
                >

                  {/* MOBILE */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                    {/* LEFT */}
                    <div className="flex items-start gap-4">

                      {/* AVATAR */}
                      <div
                        className={`min-w-[70px] w-[70px] h-[70px] rounded-full flex items-center justify-center text-2xl font-black border-4

                        ${
                          u.role === "owner"
                            ? "bg-black text-yellow-400 border-yellow-400"
                            : u.role === "vip"
                            ? "bg-black text-pink-400 border-pink-400"
                            : "bg-black text-white border-white/20"
                        }`}
                      >
                        {u.firstName?.charAt(0)}
                      </div>

                      {/* INFO */}
                      <div className="flex-1">

                        <h3 className="text-2xl font-black break-words">
                          {u.firstName}{" "}
                          {u.lastName}
                        </h3>

                        <p className="text-gray-400 break-all mt-1 text-sm md:text-base">
                          {u.email}
                        </p>

                        <div className="mt-4">

                          {u.role === "owner" && (
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-yellow-400 text-black font-black shadow-xl">

                              👑 OWNER

                            </div>
                          )}

                          {u.role === "vip" && (
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black shadow-xl">

                              👑 VIP USER

                            </div>
                          )}

                          {(!u.role ||
                            u.role ===
                              "user") && (
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/10 text-white font-black">

                              👤 USER

                            </div>
                          )}

                        </div>
                      </div>
                    </div>

                    {/* RIGHT BUTTONS */}
                    {u.role !== "owner" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-[240px]">

                        {/* VIP */}
                        {u.role !== "vip" ? (
                          <button
                            onClick={async () => {
                              await updateDoc(
                                doc(
                                  db,
                                  "users",
                                  u.id
                                ),
                                {
                                  role: "vip",
                                }
                              );

                              setUsers((prev) =>
                                prev.map((x) =>
                                  x.id === u.id
                                    ? {
                                        ...x,
                                        role: "vip",
                                      }
                                    : x
                                )
                              );
                            }}
                            className="bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-2xl font-bold hover:scale-[1.02] transition-all"
                          >
                            👑 Make VIP
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              await updateDoc(
                                doc(
                                  db,
                                  "users",
                                  u.id
                                ),
                                {
                                  role: "user",
                                }
                              );

                              setUsers((prev) =>
                                prev.map((x) =>
                                  x.id === u.id
                                    ? {
                                        ...x,
                                        role: "user",
                                      }
                                    : x
                                )
                              );
                            }}
                            className="bg-blue-600 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all"
                          >
                            👤 Remove VIP
                          </button>
                        )}

                        {/* BAN */}
                        {!u.banned ? (
                          <button
                            onClick={async () => {
                              await updateDoc(
                                doc(
                                  db,
                                  "users",
                                  u.id
                                ),
                                {
                                  banned: true,
                                }
                              );

                              setUsers((prev) =>
                                prev.map((x) =>
                                  x.id === u.id
                                    ? {
                                        ...x,
                                        banned: true,
                                      }
                                    : x
                                )
                              );
                            }}
                            className="bg-red-600 py-3 rounded-2xl font-bold hover:bg-red-700 transition-all"
                          >
                            🚫 Ban
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              await updateDoc(
                                doc(
                                  db,
                                  "users",
                                  u.id
                                ),
                                {
                                  banned: false,
                                }
                              );

                              setUsers((prev) =>
                                prev.map((x) =>
                                  x.id === u.id
                                    ? {
                                        ...x,
                                        banned: false,
                                      }
                                    : x
                                )
                              );
                            }}
                            className="bg-green-600 py-3 rounded-2xl font-bold hover:bg-green-700 transition-all"
                          >
                            ✅ Unban
                          </button>
                        )}

                      </div>
                    )}

                  </div>

                  {/* BANNED */}
                  {u.banned && (
                    <div className="mt-5 bg-red-500/20 border border-red-500 rounded-2xl p-4 text-center text-red-400 font-black">

                      🚫 THIS ACCOUNT IS BANNED

                    </div>
                  )}

                </div>
              ))}

          </div>

        </Modal>
      )}

      {/* STYLES */}
      <style jsx>{`
        .card {
          background: linear-gradient(
            135deg,
            #111827,
            #1f2937
          );

          border: 1px solid
            rgba(255, 255, 255, 0.1);

          padding: 22px;

          border-radius: 24px;

          font-weight: bold;

          font-size: 17px;

          transition: 0.3s;

          box-shadow: 0 10px 30px
            rgba(0, 0, 0, 0.35);
        }

        .card:hover {
          transform: translateY(-4px)
            scale(1.02);

          background: linear-gradient(
            135deg,
            #1f2937,
            #374151
          );
        }

        .input {
          width: 100%;
          padding: 14px;
          margin-bottom: 14px;
          border-radius: 14px;
          border: 1px solid
            rgba(255, 255, 255, 0.1);
          background: #111827;
          color: white;
          outline: none;
        }

        .btn {
          width: 100%;
          background: linear-gradient(
            135deg,
            #2563eb,
            #1d4ed8
          );
          color: white;
          padding: 14px;
          border-radius: 14px;
          font-weight: bold;
        }

        .btn-green {
          width: 100%;
          background: linear-gradient(
            135deg,
            #16a34a,
            #15803d
          );
          color: white;
          padding: 14px;
          border-radius: 14px;
          font-weight: bold;
        }
      `}</style>

    </main>
  );
}

/* ================= MODAL ================= */

function Modal({
  children,
  onClose,
}: any) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3">

      <div className="bg-[#0f172a] text-white p-5 md:p-7 rounded-3xl w-full max-w-5xl relative border border-white/10 shadow-2xl max-h-[95vh] overflow-y-auto">

        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-2xl hover:text-red-400 transition"
        >
          ✖
        </button>

        {children}

      </div>

    </div>
  );
}