import React from "react"
import {Divider, Skeleton, Stack} from "@mui/material"

export function TableWithFiltersSkeleton({linesCount = 10, filtersCount = 3, linesSize = "medium"}) {
    return <Stack spacing={2}>
        <Filters number={filtersCount}/>
        <Divider/>
        <TableLines number={linesCount} size={linesSize}/>
    </Stack>
}

export function TableSkeleton({linesCount = 10, size}) {
    return <TableLines number={linesCount} size={size}/>
}

export function TextSkeleton({height = 15, width = "100%"}) {
    return <Skeleton animation="wave" variant="rounded" width={width} height={height}/>
}

export function CriterionFormSkeleton() {
    return <Stack spacing={1}>
        <Stack spacing={2} direction="row" justifyContent="space-around" alignItems="center">
            <Skeleton animation="wave" variant="rounded" width="20%" height={20}/>
            <Skeleton animation="wave" variant="rounded" width="20%" height={20}/>
            <Skeleton animation="wave" variant="rounded" width="20%" height={20}/>
        </Stack>
        <Divider/>
        <Stack spacing={1}>
            <Skeleton animation="wave" variant="rounded" width="20%" height={20}/>
            <Skeleton animation="wave" variant="rounded" width="40vw" height={100}/>
        </Stack>
        <Divider/>
        <Stack spacing={1}>
            <Skeleton animation="wave" variant="rounded" width="20%" height={20}/>
            <Skeleton animation="wave" variant="rounded" width="40vw" height={100}/>
        </Stack>
    </Stack>
}

export function AidFormSkeleton() {
    return <Stack spacing={2} direction="row" justifyContent="space-around" alignItems="flex-start">
        <Skeleton animation="wave" variant="rounded" width="75%" height="65vh"/>
        <Skeleton animation="wave" variant="rounded" width="20%" height="45vh"/>
    </Stack>
}


function TableLines({number = 10, size = "medium"}) {
    let height
    switch (size) {
        case "small":
            height = "2vh"
            break
        case "medium":
            height = "2.5vh"
            break
        case "large":
            height = "3vh"
            break
        default:
            height = "2vh"
    }
    let skeleton = []
    for (let i = 0; i < number; i++) {
        skeleton.push(<Skeleton animation="wave" variant="rounded" width="100%" height={height}
                                key={`skeleton-${i}`}/>)
    }
    return <Stack spacing={1}>{skeleton}</Stack>
}

function Filters({number = 3}) {
    let skeleton = []
    for (let i = 0; i < number; i++) {
        skeleton.push(<Skeleton animation="wave" variant="rounded" width="20%" height={35} key={`skeleton-${i}`}/>)
    }
    return <Stack spacing={3} direction="row" justifyContent="center" alignItems="center" mt="25px" ml="10px" mr="10px">
        {skeleton}
        <Skeleton animation="wave" variant="rounded" width="50px" height={35}/>
    </Stack>
}