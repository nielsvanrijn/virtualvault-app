<script lang="ts">
    import colors from 'tailwindcss/colors'
    import { Illustration, Ellipse, TAU, Shape, Anchor, Polygon, easeInOut } from 'svelte-zdog'
    let ticker = 0
    let toLeft = true
    let rotate = true
</script>
<nav class="sticky top-0 z-20 flex justify-center border-b bg-black/30 backdrop-blur-sm border-neutral-900">
    <ul class="flex items-center w-full p-4 my-auto space-x-4 xl:max-w-7xl">
        <li class="flex items-center gap-2 mr-4 text-2xl font-medium leading-none" title="click and drag">
            <Illustration
                dragRotate
                height={30}
                onDragEnd={() => (rotate = true)}
                onDragStart={() => (rotate = false)}
                update={
                    node => delta => {
                        if (rotate) {
                            if (toLeft) {
                                node.rotate.y = easeInOut(ticker % 1, 4) * TAU/4
                                ticker += delta / 3000
                                if (ticker >= 0.99) {
                                    toLeft = false
                                }
                            } else {
                                node.rotate.y = easeInOut(ticker % 1, 4) * TAU/4
                                ticker -= delta / 3000
                                if (ticker <= 0.11) {
                                    toLeft = true
                                }
                            }
                        }
                    }
                }
                width={30}
            >
                <Polygon
                    color="{colors.indigo[500]}"
                    fill={true}
                    radius={12}
                    rotate={{ z: TAU/2 }}
                    sides={3}
                    stroke={false}
                    translate={{ z: 10.44, y: -2 }}
                />
                <Polygon
                    color="{colors.blue[800]}"
                    fill={true}
                    radius={12}
                    rotate={{ z: TAU/2, y: TAU/4 }}
                    sides={3}
                    stroke={false}
                    translate={{ x: 10.44, y: -2 }}
                />
            </Illustration>
            Virtual Vualt
        </li>
        <li>
            <a class="font-medium" href="/welcome">Welcome</a>
        </li>
        <li>
            <a class="text-neutral-400" href="/welcome">Latest releases</a>
        </li>
        <li>
            <a class="text-neutral-400" href="/welcome">All games</a>
        </li>
    </ul>
</nav>