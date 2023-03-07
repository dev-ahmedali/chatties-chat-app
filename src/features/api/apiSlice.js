import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query"

export const apiSlice = createApi({
    reudcerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_URL
    }),
    tagTypes: [],
    endpoints: (builder) => ({}),
})