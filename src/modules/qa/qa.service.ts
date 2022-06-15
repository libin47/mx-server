import { Injectable, Inject, forwardRef } from '@nestjs/common'
import { ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from '~/transformers/model.transformer'
import { CannotFindException } from '~/common/exceptions/cant-find.exception'
import { QAModel } from './qa.model'

@Injectable() 
export class QAService {
  constructor(
    @InjectModel(QAModel) private readonly qaModel: MongooseModel<QAModel>
  ) {
    this.createDefaultQA()
  }

  async findQAById(QAId: string) {
    const QA = await this.model.findById(QAId).lean()
    return QA
  }

  async checkAnswer(QAId:string, answer:string){
    const QA = await this.model.findById(QAId)
    if (!QA) {
      throw new CannotFindException()
    }
    for(var i=0;i<QA.answer.length;i++){
      if(QA.answer[i]==answer){
        return true
      }
    }
    return false
  }

  async findAllQA() {
    const data = await this.model.find().lean()
    return data
  }

  get model() {
    return this.qaModel
  }

  async createDefaultQA() {
    if ((await this.model.countDocuments()) === 0) {
      var answer: string[]
      answer = ["答案"]
      return await this.model.create({
        question: '这是一个默认问题，答案是答案',
        answer: answer,
      })
    }
  }
}
