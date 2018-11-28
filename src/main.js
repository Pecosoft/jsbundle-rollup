import m1 from './modules/m1'
import { m2, hello, world, t8t } from './modules/ms'

export default function () {
  m1()
  m2()
  hello(world)
  hello(t8t)
}
