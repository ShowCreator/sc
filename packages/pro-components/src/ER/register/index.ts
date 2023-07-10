/*
 * @Author: sfy
 * @Date: 2023-05-14 10:57:06
 * @LastEditors: sfy
 * @LastEditTime: 2023-05-14 11:05:59
 * @FilePath: /sqlG/src/Process/register/index.ts
 * @Description: update here
 */
import { diceErBoxReg } from './dice-er-box'
import { diceErLineReg } from './dice-er-line'
import { diceErScrollReg } from './dice-er-scroll'

export const register = () => {
  diceErBoxReg()
  diceErLineReg()
  diceErScrollReg()
}